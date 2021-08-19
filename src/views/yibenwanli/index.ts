import _ from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { YIBENWANLI, T_YIBENWANLI_ITEM } from '@/vendors/shopping';
import { API_QUERY_ONE_TASK_DATA, API_TASK_AWARD_STATUS, RES_QUERY_ONE_TASK_DATA, T_TASK_DATA } from '@/vendors/api';
import { onBeforeMount, onUnmounted, ref, watch } from 'vue';

dayjs.extend(relativeTime);
dayjs.extend(duration);

/**
 * 解析字符串lua代码
 * @param code 代码字符串
 * @return 已购买的礼包id数组、有效时长
 */
function parseStringCode(code: string) {
  code = code
    .replace(/\t\n/g, '')
    .replace(/\t/g, '')
    .replace(/\n/g, '')
    .replace(/=/g, ':')
    .replace(/]/g, '')
    .replace(/\[/g, '')
    .slice(1)
    .slice(0, -1)
    .replace(/valid_time/, '&valid_time')
    .replace(/bought_gift_bag_ids/, '&bought_gift_bag_ids')
    .replace(/gift_bag_sp_ids/, '&gift_bag_sp_ids')
    .replace(/children_task_ids/, '&children_task_ids')
    .slice(1);

  const codeArray = code.split('&');
  const timeStr = codeArray.find((s) => s.startsWith('valid_time'));
  const taskStr = codeArray.find((s) => s.startsWith('children_task_ids'));

  let boughtList: number[] = [];
  let validTime;

  if (timeStr) {
    const t = timeStr.split(':')[1];
    if (t.endsWith(',')) validTime = t.slice(0, t.length - 1);
    else validTime = t;
  }
  if (taskStr) {
    boughtList = YIBENWANLI.filter((item) => taskStr.indexOf(item.taskid.toString()) !== -1).map((item) => item.id);
  }

  return {
    boughtList,
    validTime,
  };
}

/**
 * 切换礼包后的相关响应式数据变化
 *
 * 1.激活的礼包ID
 *
 * 2.礼包配置
 *
 * 3.礼包状态
 */
export function activeObserve() {
  const activeID = ref(YIBENWANLI[0]['id']);
  const activeConfig = ref<T_YIBENWANLI_ITEM>(YIBENWANLI[0]);
  const activeStatus = ref<T_TASK_DATA>();
  const activeAwards = ref<number[]>([]);

  const fetchActiveAwards = (taskid: number) => {
    const res = YIBENWANLI.find((row) => row.taskid === taskid)!;
    // 请求任务下各个阶段的奖励领取状态
    const awardStatus = API_TASK_AWARD_STATUS(taskid, res.awards.length);
    if (awardStatus) {
      awardStatus.then(({ result }) => {
        activeAwards.value = result || [];
      });
    } else {
      activeAwards.value = [];
    }
  };

  const activeCallback = async (value: number) => {
    const res = YIBENWANLI.find((row) => row.id === value)!;

    activeConfig.value = res;

    // 请求任务数据
    const { task_data } = await API_QUERY_ONE_TASK_DATA(res.taskid);

    fetchActiveAwards(res.taskid);

    activeStatus.value = task_data;
  };

  watch(activeID, activeCallback, { immediate: true });

  return {
    activeID,
    activeConfig,
    activeStatus,
    activeCallback,
    activeAwards,
    fetchActiveAwards,
  };
}

/**
 * 1.请求一本万利活动总状态，任务ID为1000099，需要从中获取的数据有：
 * 已经购买的礼包
 *
 * 2.所有的礼包都要根据其任务ID向服务器发送请求，从而知道这些礼包下面有哪些已经完成的阶段任务而没有领取奖励
 */
export function fullFetch() {
  /** 没有领取的列表，值为任务ID */
  const noreceive = ref<number[]>([]);

  /** 已购买的礼包数组，值为礼包ID */
  const bought = ref<number[]>([]);

  /** 有效期倒计时 */
  let timer: null | number = null;
  const cutdown = ref('');
  const interval = (timeStamp: number) => {
    const tim = dayjs.unix(timeStamp);
    return setInterval(() => {
      const diff = tim.diff(dayjs());

      if (diff <= 0) {
        // 到期时清除定时器，重新请求状态数据

        if (timer) {
          clearInterval(timer);
        }

        _.delay(() => {
          getFullStatus();
          getNoreceive();
        }, 2000);
      } else if (diff < 24 * 60 * 60 * 1000) {
        cutdown.value = dayjs.duration(diff, 'ms').format('H:mm:ss');
      } else {
        cutdown.value = dayjs.duration(diff, 'ms').format('D天H:mm:ss');
      }
    }, 1000);
  };

  const getFullStatus = () => {
    API_QUERY_ONE_TASK_DATA(1000099).then(({ task_data }) => {
      if (task_data) {
        const { boughtList, validTime } = parseStringCode(task_data.other_data_str || '');

        bought.value = boughtList;

        if (validTime) {
          timer = interval(_.toNumber(validTime));
        }
      }
    });
  };

  const getNoreceive = () => {
    const list: Array<Promise<RES_QUERY_ONE_TASK_DATA>> = [];

    YIBENWANLI.forEach((object) => list.push(API_QUERY_ONE_TASK_DATA(object.taskid)));

    Promise.all(list).then((resolve) => {
      resolve.forEach(({ task_data }) => {
        if (task_data) {
          const { award_status, id } = task_data;
          if (award_status === 1) {
            noreceive.value.push(id);
          }
        }
      });
    });
  };

  onBeforeMount(() => {
    getFullStatus();
    getNoreceive();
  });

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  return {
    bought,
    cutdown,
    noreceive,
    getFullStatus,
    getNoreceive,
  };
}
