import { fetchClientConfig } from '@/network';
import excelProxy from '@/utils/excel-proxy';
import { ref } from 'vue';
import dayjs from 'dayjs';
import activeMenu from './active-menu';

const activityList = ref<Record<string, unknown>[]>([]);

fetchClientConfig('/game_activity/config/game_activity_config.json').then((response) => {
  const config = response['config|其他配置'];
  console.log(config);
  const configProxy = excelProxy(config);
  const be = configProxy[47]['beginTime'] as number;
  console.log(dayjs.unix(be) > dayjs());

  // 活动开关
  const onAct = configProxy.filter((item) => item['is_on_off'] === 1);

  // 时间限制
  const current = dayjs();
  const timeAct = onAct.filter((item) => {
    const begin = item['beginTime'] as number,
      end = item['endTime'] as number;

    if (begin === -1) {
      if (end === -1) return true;

      if (dayjs.unix(end) > current) return true;

      return false;
    }

    if (dayjs.unix(begin) < current) {
      if (end === -1) return true;

      if (dayjs.unix(end) > current) return true;

      return false;
    }

    return false;
  });

  activeMenu.value = timeAct[0]['ID'] as number;

  activityList.value = timeAct;
});

export { activityList };
