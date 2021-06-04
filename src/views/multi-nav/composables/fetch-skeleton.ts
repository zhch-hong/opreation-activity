import { fetchClientConfig, fetchMessage } from '@/network';
import excelProxy from '@/utils/excel-proxy';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { isBrowser } from '@/runtime-env';
import store from '@/store';
import axios from 'axios';

type ActList = Record<string, unknown>[];

function filtSwitch(list: ActList) {
  return list.filter((item) => item['is_on_off'] === 1);
}

function filtTime(list: ActList) {
  const current = dayjs();

  return list.filter((item) => {
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
}

function filtPermission(list: ActList): Promise<ActList> {
  return new Promise((resolve) => {
    const permissionAct: ActList = [];

    list.forEach((item, index) => {
      if (!item['condi_key']) {
        permissionAct.push(item);

        if (index === list.length - 1) {
          resolve(permissionAct);
        }

        return;
      }

      if (isBrowser) {
        const data = {
          name: 'judge_permission',
          user_id: store.state.user.user_id,
          data: { permission: item['condi_key'] },
        };
        axios({
          baseURL: store.state.baseURL,
          url: `msg_call`,
          method: 'POST',
          data,
          headers: {
            token: store.state.token,
            userid: store.state.user.user_id,
          },
        }).then(({ data }) => {
          if (data['effect']) permissionAct.push(item);

          if (index === list.length - 1) {
            resolve(permissionAct);
          }
        });
      } else {
        fetchMessage<Record<'result', boolean>>(`unityfun://checkpermiss?1_string=${item['condi_key']}`, true)?.then(
          ({ result }) => {
            if (result) {
              permissionAct.push(item);
            }

            if (index === list.length - 1) {
              resolve(permissionAct);
            }
          }
        );
      }
    });
  });
}

export default () => {
  const activityList = ref<ActList>([]);

  fetchClientConfig('/game_activity/config/game_activity_config.json').then(async (response) => {
    const config = response['config|其他配置'];
    const configProxy = excelProxy(config);

    // 活动开关
    const onAct = filtSwitch(configProxy);

    // 时间限制
    const timeAct = filtTime(onAct);

    // 权限验证
    const permissionAct = await filtPermission(timeAct);

    activityList.value = permissionAct;
  });

  return activityList;
};
