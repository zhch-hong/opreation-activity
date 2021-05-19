import { ref, watch } from 'vue';
import { fetchClientConfig } from '@/network';

const itemConfigList = fetchClientConfig();
const notifyStack = ref<Record<string, unknown>[]>([]);
const stackCutdown = ref(0);
const notifyData = ref<Record<string, unknown> | null>(null);
const modalVisible = ref<'none' | 'block'>('none');
const triggerUpdate = ref(0);

function enumAsset(type: string) {
  const r = itemConfigList.value.find((e) => e['item_key|道具key，全局唯一'] === type);
  return (v: number | string) => {
    return {
      label: r ? r['name|道具名称'] : '',
      number: v,
      icon: r ? r['image|道具图片名'] + '.png' : '',
    };
  };
}

const excludeType = (type: string) => {
  const array = ['treasure_bowl'];
  const i = array.findIndex((e) => type.startsWith(e));
  return i === -1;
};

const ENUM_MSG: Record<string, (params: Record<string, unknown>) => void> = {
  notify_asset_change_msg(params: Record<string, unknown>) {
    const data = params.data as Record<string, unknown>;

    if (excludeType(data.type as string)) {
      const change_asset = data.change_asset as Record<string, unknown>[];
      change_asset.forEach((item) => {
        const asset_type = item.asset_type as string;
        const asset_value = item.asset_value as number | string;
        const n = enumAsset(asset_type)(asset_value);
        notifyStack.value.push(n);
      });
    }
  },
};

function notify(params: Record<string, unknown>[]) {
  triggerUpdate.value++;

  params.forEach((item) => {
    ENUM_MSG[item.name as string](item);
  });

  if (stackCutdown.value === 0) stackCutdown.value++;
}

watch(
  stackCutdown,
  () => {
    const n = notifyStack.value.shift();
    if (n) {
      notifyData.value = {
        label: n.label,
        number: n.number,
        icon: n.icon,
      };
      modalVisible.value = 'block';
    } else {
      notifyData.value = null;
      modalVisible.value = 'none';
      stackCutdown.value = 0;
    }
  },
  {
    immediate: true,
  }
);

export { modalVisible, notify, triggerUpdate, notifyData, stackCutdown };
