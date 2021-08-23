import _ from 'lodash';
import { createApp, h, ref } from 'vue';
import { emitter } from '@/vendors/window-listener';

import NotifyCompnent from './index.vue';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ITEM_CONFIG: Record<string, unknown>[] = require('@/assets/json/item_config.json')['config'];

type Asset = {
  name: string;
  count: number;
};

/**
 * 获取资产名称和icon链接
 * @param name
 * @returns
 */
function getAssetContent(name: string) {
  const item = ITEM_CONFIG.find((row) => row['item_key'] === name);
  const content: Record<string, unknown> = { name: undefined, icon: undefined };
  if (typeof item !== 'undefined') {
    content.name = item.name;
    content.icon = `${process.env.VUE_APP_ASSET_URL}/game_activity/item_config_image/${item['image']}.png`;
  }
  return content;
}

/**
 * 待通知的资产队列
 */
const notifyStack: Asset[] = [];
/**
 * 当前正在通知的资产队列
 */
const currentStack = ref<Asset[]>([]);
/**
 * 是否显示弹窗
 */
const show = ref(false);

/**
 * 资产通知消息会发送到每一个webview，所以当webview显示时需要清除通知，以免在A活动中的资产通知，出现在了B活动中
 */
emitter.on('webviewWillAppear', () => {
  notifyStack.splice(0, notifyStack.length);
  show.value = false;
});

const app = createApp(
  h(NotifyCompnent, {
    show,
    notifyList: currentStack,
    onConfirm: function () {
      if (notifyStack.length === 0) {
        show.value = false;
      } else {
        currentStack.value = _.cloneDeep(notifyStack);
        notifyStack.splice(0, notifyStack.length);
      }
    },
  })
);
let isMounted = false;
let timeout: null | number = null;
export default (assets: Asset[]): void => {
  notifyStack.push(...assets);

  if (!show.value) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;

      currentStack.value = _.cloneDeep(notifyStack);
      notifyStack.splice(0, notifyStack.length);

      if (!isMounted) {
        const div = document.createElement('div');
        document.querySelector('#app')?.append(div);
        app.mount(div).$nextTick(() => {
          isMounted = true;
          show.value = true;
        });
      } else {
        show.value = true;
      }
    }, 1500);
  }
};

export { Asset, getAssetContent };
export { default as notifyValidate } from './asset-notify-validate';
