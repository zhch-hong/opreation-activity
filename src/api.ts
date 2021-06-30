import { fetchCall } from '@/network';

/**
 * 查询礼包状态响应数据
 */
type RES_QUERY_GIFT_BAG_STATUS = {
  /** 礼包ID */
  gift_bag_id: number;
  permit_start_time: number;
  permit_time: number;
  remain_time: number;
  result: number;
  status: 0 | 1;
  time: number;
};
/**
 * 查询礼包状态，1 能购买，0 不能购买
 * @param id
 * @returns
 */
export function API_QUERY_GIFT_BAG_STATUS(id: number) {
  return fetchCall<RES_QUERY_GIFT_BAG_STATUS>({ name: 'query_gift_bag_status', data: { gift_bag_id: id } });
}

/**
 * 月卡信息
 */
export type RES_QUERY_NEW_YUEKA_BASE_INFO = {
  /** 0 成功 */
  result: number;

  /** 购买豪华月卡的时间 */
  buy_time_1: number;

  /** 豪华月卡剩余使用次数 */
  total_remain_num_1: number;

  /** 豪华月卡今天是否使用，0 未使用，1 已使用 */
  is_receive_1: number;

  /** 上一次处理豪华月卡时间 */
  last_use_yueka_1: number;

  /** 尊享月卡购买时间 */
  buy_time_2: number;

  /** 尊享月卡剩余使用 */
  total_remain_num_2: number;

  /** 尊享月卡今天是否使用 */
  is_receive_2: number;

  /** 上一次处理尊享月卡时间 */
  last_use_yueka_2: number;

  /** 服务器时间 */
  server_time: number;
};
/**
 * 查询月卡信息
 * @returns
 */
export function API_QUERY_NEW_YUEKA_BASE_INFO() {
  return fetchCall<RES_QUERY_NEW_YUEKA_BASE_INFO>({ name: 'query_new_yueka_base_info', data: {} });
}

/**
 * 购买尊享月卡后，领取每日奖励
 */
export function API_NEW_YUEKA_RECEIVE_AWARD() {
  return fetchCall<Record<'result', number>>({ name: 'new_yueka_receive_award', data: {} });
}

/**
 * 季卡数据
 */
type RES_QUERY_JIKA_BASE_INFO = {
  /** 0 成功 */
  result: number;

  /** 购买时间 */
  buy_time: number;

  /** 剩余抽奖次数 */
  total_remain_num: number;

  /** 抽奖状态 */
  is_lottery: number;

  /** 服务器时间 */
  server_time: number;
};
/**
 * 请求季卡信息
 * @returns
 */
export function API_QUERY_JIKA_BASE_INFO() {
  return fetchCall<RES_QUERY_JIKA_BASE_INFO>({
    name: 'query_jika_base_info',
    data: {},
  });
}

type RES_GET_TASK_AWARD = {
  result: number;
  id: number;
};
/**
 * 领取系统升级奖励
 * @param id 任务ID
 * @returns
 */
export function API_GET_TASK_AWARD(id: number) {
  return fetchCall<RES_GET_TASK_AWARD>({ name: 'get_task_award', data: { id } });
}
