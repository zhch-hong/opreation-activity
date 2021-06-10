import { fetchClientConfig, fetchMessage } from '@/network';
import excelProxy from '@/utils/excel-proxy';
import { ref } from 'vue';
import dayjs from 'dayjs';
import { isBrowser } from '@/runtime-env';
import store from '@/store';
import axios from 'axios';
import _ from 'lodash';

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
    const promiseList: Array<Promise<any>> = [];

    list.forEach((item, index) => {
      if (isBrowser) {
        if (!item['condi_key']) {
          promiseList.push(Promise.resolve({ data: { effect: true } }));
        } else {
          const data = {
            name: 'judge_permission',
            user_id: store.state.user.user_id,
            data: { permission: item['condi_key'] },
          };
          const promise = axios({
            baseURL: store.state.baseURL,
            url: `msg_call`,
            method: 'POST',
            data,
            headers: {
              token: store.state.token,
              userid: store.state.user.user_id,
            },
          });
          promiseList.push(promise);
        }
      } else {
        if (!item['condi_key']) {
          promiseList.push(Promise.resolve({ result: true }));
        } else {
          const promise = fetchMessage<Record<'result', boolean>>(
            `unityfun://checkpermiss?1_string=${item['condi_key']}`,
            true
          );

          promiseList.push(promise!);
        }
      }
    });

    if (isBrowser) {
      Promise.all<Record<string, unknown>>(promiseList).then((value) => {
        value.forEach((item, index) => {
          const data = item.data as Record<'effect', boolean>;

          if (data.effect) {
            permissionAct.push(list[index]);
          }
        });

        resolve(permissionAct);
      });
    } else {
      Promise.all<Record<'result', boolean>>(promiseList).then((value) => {
        value.forEach((item, index) => {
          if (item.result) {
            permissionAct.push(list[index]);
          }
        });

        resolve(permissionAct);
      });
    }
  });
}

const activityList = ref<ActList>([]);
export default () => {
  if (activityList.value.length === 0) {
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
  }

  return activityList;
};
