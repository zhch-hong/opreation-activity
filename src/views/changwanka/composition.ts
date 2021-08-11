import {
  API_QUERY_CHANG_WAN_KA_BASE_INFO,
  API_QUERY_GIFT_BAG_STATUS,
  API_QUERY_ONE_TASK_DATA,
  API_REFRESH_CHANG_WAN_KA_TASK,
} from '@/vendors/api';
import { CHANGWANKA, CHANGWANKATASK, T_CWK_TASK } from '@/vendors/shopping';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import _ from 'lodash';
import { onBeforeMount, reactive, ref } from 'vue';
import { SKT_QUERY_CHANG_WAN_KA_BASE_INFO, SKT_TASK_CHANGE_MSG } from '@/vendors/api-socket';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export type T_TASK_ROW = T_CWK_TASK & {
  /** 领取状态 */
  status: number;
  /** 剩余次数 */
  remainNum: number;
  /** 当前进度 */
  progress: number;
  /** 奖励图标 */
  awardIcon: string;
  /** 奖励描述 */
  awardText: string;
};

const tempTask: T_TASK_ROW = {
  taskid: 0,
  text: '',
  total: 0,
  award: 0,
  type: '',
  status: 0,
  remainNum: 0,
  progress: 0,
  awardIcon: '',
  awardText: '',
};

export default _.once(function () {
  /**
   * 是否购买了礼包
   */
  const boughtStatus = ref(false);

  /**
   * 过期时间
   */
  const overTime = ref('');

  /**
   * 是否显示3万金币（第一次刷新任务免费，之后3万/次）
   */
  const showRefreshSub = ref(false);

  let timer: number | null = null;
  /**
   * 开启倒计时
   * @param timeStamp
   */
  const startLoopTime = (timeStamp: number) => {
    if (timer) clearInterval(timer);

    const tim = dayjs.unix(timeStamp);

    timer = setInterval(() => {
      const diff = tim.diff(dayjs());

      if (diff <= 0) {
        // 到期时清除定时器，重新请求状态数据
        if (timer) {
          clearInterval(timer);
        }

        _.delay(() => {
          fetchBoughtStatus();
        }, 2000);
      } else if (diff < 24 * 60 * 60 * 1000) {
        overTime.value = dayjs.duration(diff, 'ms').format('H:mm:ss');
      } else {
        overTime.value = dayjs.duration(diff, 'ms').format('D天H:mm:ss');
      }
    }, 1000);
  };

  // 第一、二、三条任务
  const taskTop = reactive<T_TASK_ROW>(_.cloneDeep(tempTask));
  const taskMid = reactive<T_TASK_ROW>(_.cloneDeep(tempTask));
  const taskBot = reactive<T_TASK_ROW>(_.cloneDeep(tempTask));

  /**
   * 请求礼包购买状态
   */
  const fetchBoughtStatus = () => {
    API_QUERY_GIFT_BAG_STATUS(CHANGWANKA.id).then(({ status }) => {
      boughtStatus.value = status === 0;
    });
  };

  /**
   * 请求畅玩卡数据
   */
  const fetchChangwanka = () => {
    API_QUERY_CHANG_WAN_KA_BASE_INFO().then(
      ({ result, remain_num_1, remain_num_2, remain_num_3, over_time, refresh_task_num }) => {
        if (result === 0) {
          taskTop.remainNum = remain_num_1;
          taskMid.remainNum = remain_num_2;
          taskBot.remainNum = remain_num_3;

          startLoopTime(over_time);

          showRefreshSub.value = refresh_task_num !== 0;
        }
      }
    );
  };

  const fetchTaskTop = () => {
    API_QUERY_ONE_TASK_DATA(21319).then(({ task_data }) => {
      if (task_data) {
        taskTop.taskid = 21319;
        taskTop.text = '登录时可领取';
        taskTop.total = 1;
        taskTop.award = 1;
        taskTop.status = task_data.award_status;
        taskTop.progress = 1;
        taskTop.awardIcon = 'ty_icon_jb_30y';
        taskTop.awardText = '40万金币';
      }
    });
  };

  const fetchTaskMid = () => {
    API_QUERY_ONE_TASK_DATA(21320).then(({ task_data }) => {
      if (task_data) {
        const { other_data_str } = task_data;
        if (other_data_str) {
          const t = CHANGWANKATASK.find((c) => c.taskid === _.toNumber(other_data_str));
          if (t) Object.assign(taskMid, t);
          taskMid.awardIcon = 'ty_icon_jb_15y';
          taskMid.awardText = '10万金币';

          API_QUERY_ONE_TASK_DATA(_.toNumber(other_data_str)).then(({ task_data }) => {
            if (task_data) {
              taskMid.progress = _.toNumber(task_data.now_total_process);
              taskMid.status = task_data.award_status;
            }
          });
        }
      }
    });
  };

  const fetchTaskBot = () => {
    API_QUERY_ONE_TASK_DATA(21321).then(({ task_data }) => {
      if (task_data) {
        const { other_data_str } = task_data;
        if (other_data_str) {
          const t = CHANGWANKATASK.find((c) => c.taskid === _.toNumber(other_data_str));
          if (t) Object.assign(taskBot, t);
          taskBot.awardIcon = 'ty_icon_flq';
          taskBot.awardText = '400福利券';

          API_QUERY_ONE_TASK_DATA(_.toNumber(other_data_str)).then(({ task_data }) => {
            if (task_data) {
              taskBot.progress = _.toNumber(task_data.now_total_process);
              taskBot.status = task_data.award_status;
            }
          });
        }
      }
    });
  };

  /**
   * 刷新任务
   * @param index
   */
  const refreshHandler = (index: number) => {
    API_REFRESH_CHANG_WAN_KA_TASK(index).then(({ result }) => {
      if (result === 0) {
        if (index === 1) fetchTaskMid();
        if (index === 2) fetchTaskBot();

        fetchChangwanka();
      }
    });
  };

  onBeforeMount(() => {
    fetchBoughtStatus();
  });

  return {
    taskTop,
    taskMid,
    taskBot,
    overTime,
    boughtStatus,
    refreshHandler,
    showRefreshSub,
    fetchChangwanka,
    fetchBoughtStatus,
    fetchTaskTop,
    fetchTaskMid,
    fetchTaskBot,
  };
});
