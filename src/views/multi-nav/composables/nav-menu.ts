import { fetchClientConfig, fetchMessage } from '@/vendors/network';
import { reactive } from 'vue';
import dayjs from 'dayjs';
import { isBrowser } from '@/vendors/runtime-env';
import store from '@/store';
import axios from 'axios';
import _ from 'lodash';
import { API_CHECK_PERMISS } from '@/vendors/api';

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

function filtPermissions(list: ActList): Promise<ActList> {
  return new Promise((resolve) => {
    const permissionAct: ActList = [];
    const promiseList: Array<Promise<any>> = [];

    list.forEach((item) => {
      if (!item['condi_key']) {
        promiseList.push(Promise.resolve({ result: true }));
      } else {
        const promise = API_CHECK_PERMISS(item['condi_key'] as string);

        promiseList.push(promise!);
      }
    });

    Promise.all<Record<'result', boolean>>(promiseList).then((value) => {
      value.forEach((item, index) => {
        if (item.result) {
          permissionAct.push(list[index]);
        }
      });

      resolve(permissionAct);
    });
  });
}

const beforePermissions: ActList = [];
const menuList = reactive<ActList>([]);

/**
 * 是否已经请求过配置文件了
 */
let isFetch = false;

/**
 * 获取活动菜单，从服务器请求配置文件，然后根据开关和时间过滤，不包括权限过滤，权限过滤需要发送到客户端判断
 * @returns
 */
function getMenu() {
  if (isFetch) return menuList;

  isFetch = true;

  fetchClientConfig('/game_activity/config/game_activity_config.json').then(async (response) => {
    const config = response['config'];

    // 活动开关
    const onAct = filtSwitch(config);

    // 时间限制
    const timeAct = filtTime(onAct);

    beforePermissions.splice(0, 999, ...timeAct);

    const array = await filtPermissions(timeAct);
    menuList.splice(0, 999, ...array);
  });

  return menuList;
}

async function updateMenu() {
  const array = await filtPermissions(beforePermissions);
  menuList.splice(0, 999, ...array);
}

export { getMenu, updateMenu };
