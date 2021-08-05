import { API_QUERY_ALL_RETURN_LB_INFO, API_QUERY_ONE_TASK_DATA, RES_QUERY_ONE_TASK_DATA, T_TASK_DATA } from '@/api';
import { QUANFANLIBAO, T_QFLB_GIFT } from '@/shopping';
import _ from 'lodash';
import { once } from 'lodash';
import { nextTick, reactive, ref, watch, WatchStopHandle } from 'vue';

export const activeObserver = once(() => {
  /** 当前选中的礼包ID */
  const activeID = ref(QUANFANLIBAO[0].id);
  /** 当前选中的礼包任务配置 */
  const activeConfig = ref<T_QFLB_GIFT>(QUANFANLIBAO[0]);
  /** 当前选中礼包的任务进度 */
  const progress = ref(0);
  /** 已购买的礼包ID */
  const bought = reactive<number[]>([]);
  /** 当前选中礼包的剩余天数 */
  const cutdown = ref(0);
  /** 每个礼包的剩余天数 */
  const cutdownMap = reactive<Record<string, number>>({ 10084: 0, 10085: 0, 10086: 0 });
  /** 奖励领取状态 */
  const awardStatus = ref(0);

  let watchIDStop: WatchStopHandle | null = null;

  const queryCurrentTask = () => {
    API_QUERY_ONE_TASK_DATA(activeConfig.value.taskid).then(({ task_data }) => {
      if (typeof task_data !== 'undefined') {
        const { now_total_process, award_status } = task_data;
        progress.value = _.toNumber(now_total_process);
        awardStatus.value = award_status;
      }
    });
  };

  const queryAll = () => {
    API_QUERY_ALL_RETURN_LB_INFO().then((response) => {
      const { result, all_return_lb_1, all_return_lb_2, all_return_lb_3 } = response;
      if (result === 0) {
        if (all_return_lb_1.remain_num > 0) {
          if (!bought.includes(10084)) bought.push(10084);
        }
        if (all_return_lb_2.remain_num > 0) {
          if (!bought.includes(10085)) bought.push(10085);
        }
        if (all_return_lb_3.remain_num > 0) {
          if (!bought.includes(10086)) bought.push(10086);
        }

        cutdownMap['10084'] = all_return_lb_1.remain_num;
        cutdownMap['10085'] = all_return_lb_2.remain_num;
        cutdownMap['10086'] = all_return_lb_3.remain_num;
      }

      if (watchIDStop !== null) watchIDStop();

      watchIDStop = watch(
        activeID,
        (id) => {
          const result = QUANFANLIBAO.find((item) => item.id === id);
          if (typeof result !== 'undefined') {
            activeConfig.value = result;

            if (bought.includes(id)) {
              cutdown.value = cutdownMap[id];
              nextTick(queryCurrentTask);
            }
          }
        },
        {
          immediate: true,
        }
      );
    });
  };

  return {
    activeID,
    activeConfig,
    bought,
    progress,
    cutdown,
    awardStatus,
    queryAll,
    queryCurrentTask,
  };
});
