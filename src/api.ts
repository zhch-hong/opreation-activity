import { fetchCall, fetchMessage } from '@/network';
import axios from 'axios';
import { isWebview } from './runtime-env';
import store from './store';

// ========================================= 页面缩放
/**
 * 页面大小适配缩放值
 * @param scale
 */
export function API_APP_SCALE(scale: string) {
  fetchMessage(`unityfun://storage?1_string=scale&2_string=${scale}`, false);
}

// ========================================= 浏览器
/**
 * 打开系统浏览器
 * @param url
 */
export function API_OPEN_BROWSER(url: string) {
  fetchMessage(`unityfun://openurl?1_url=${encodeURIComponent(url)}`, false);
}

// ========================================= 支付方式
export type RES_GET_PAY_TYPES = {
  result: number;
  types?: Record<'channel' | 'child_channel', string>[];
};
/**
 * 支付方式
 * @param giftID
 */
export function API_GET_PAY_TYPES(giftID: number) {
  return fetchCall<RES_GET_PAY_TYPES>('get_pay_types', { goods_id: giftID });
}

// ========================================= 创建订单
export type RES_CREATE_PAY_ORDER = {
  order_id: string;
  result: number;
  url: string;
};
/**
 * 创建订单
 * @param id 商品ID
 * @param channel 支付渠道[微信，支付宝，云闪付，...]
 * @param geturl
 * @param convert
 * @returns
 */
export function API_CREATE_PAY_ORDER(id: number, channel: string, geturl = 'y', convert = undefined) {
  return fetchCall<RES_CREATE_PAY_ORDER>('create_pay_order', {
    goods_id: id,
    channel_type: channel,
    geturl,
    convert,
  });
}

// ========================================= 权限查询
/**
 * 权限查询
 * @param name
 * @returns
 */
export function API_CHECK_PERMISS(name: string) {
  if (isWebview) {
    return fetchMessage<Record<'result', boolean>>(`unityfun://checkpermiss?1_string=${name}`, true)!;
  }

  return new Promise<Record<'result', boolean>>((resolve) => {
    axios({
      baseURL: store.state.baseURL,
      url: `msg_call`,
      method: 'POST',
      data: {
        name: 'judge_permission',
        user_id: store.state.user.user_id,
        data: { permission: name },
      },
      headers: {
        token: store.state.token,
        userid: store.state.user.user_id,
      },
    }).then(({ data }) => {
      resolve({ result: data.effect });
    });
  });
}

// ========================================= 礼包状态

export type RES_QUERY_GIFT_BAG_STATUS = {
  /** 礼包ID */
  gift_bag_id: number;
  permit_start_time: number;
  permit_time: number;
  remain_time: number;
  result: number;
  /** 1 能购买，0 不能购买 */
  status: 0 | 1;
  time: number;
};
/**
 * 查询礼包
 * @param id
 * @returns
 */
export function API_QUERY_GIFT_BAG_STATUS(id: number) {
  return fetchCall<RES_QUERY_GIFT_BAG_STATUS>('query_gift_bag_status', { gift_bag_id: id });
}

// ========================================= 任务状态
export type T_AWARD_DATA = {
  asset_type: string;
  asset_value: number;
};
export type T_FIX_AWARD_DATA = {
  award_data: T_AWARD_DATA;
};
export type T_TASK_DATA = {
  /** 奖励领取的状态 */
  award_get_status: string;
  /** 0-不能领取 | 1-可领取 | 2-已完成 | 3- 未启用 */
  award_status: number;
  /** 创建时间 */
  create_time: string;
  /** 结束的有效时间 */
  end_valid_time: string;
  /** 任务ID */
  id: number;
  /** 当前等级需要的总进度 */
  need_process: string;
  /** 当前等级 */
  now_lv: number;
  /** 当前等级总进度 */
  now_process: string;
  /** 当前总进度 */
  now_total_process: string;
  /** 其他数据 */
  other_data_str?: {
    valid_time: number;
    /** 已购买的礼包ID */
    bought_gift_bag_ids: number[];
    /** 购买的礼包相对应的任务ID */
    children_task_ids: number[];
  };
  /** 过期时间 */
  over_time: string;
  /** 开始的有效时间 */
  start_valid_time: string;
  /** 应该领取的奖励档位 */
  task_round: number;
  /** 任务类型 */
  task_type: string;
  /** 任务的条件类型(按什么条件来加进度) */
  task_condition_type?: string;
  /** 固定奖励类型 */
  fix_award_data?: T_FIX_AWARD_DATA;
};
export type RES_QUERY_ONE_TASK_DATA = {
  result: number;
  task_data?: T_TASK_DATA;
};
/**
 * 查询任务
 * @param id 任务ID
 * @returns
 */
export function API_QUERY_ONE_TASK_DATA(id: number) {
  return fetchCall<RES_QUERY_ONE_TASK_DATA>('query_one_task_data', { task_id: id });
}

// ========================================= 跳转到原生活动
/**
 * 跳转到原生活动
 * @param key 活动的模块key值
 * @param panel 活动的界面UI
 */
export function API_BREAK_ACTIVITY(key: string, panel: string) {
  if (isWebview) {
    fetchMessage<void>(`unityfun://gotoui?1_string=${key}&2_string=${panel}`, false);
  } else {
    console.log('跳转到原生活动，浏览器环境不支持', `unityfun://gotoui?1_string=${key}&2_string=${panel}`);
  }
}

// ========================================= 领取奖励（多阶段任务）
export type T_AWARD_DATAⅡ = {
  asset_type: string;
  asset_value: number;
  award_name: string;
};
export type RES_GET_TASK_AWARD_NEW = {
  result: number;
  id: number;
  award_list: T_AWARD_DATAⅡ;
};
/**
 * 领取奖励（多阶段任务）
 * @param taskid
 * @param level
 * @returns
 */
export function API_GET_TASK_AWARD_NEW(taskid: number, level: number) {
  return fetchCall<RES_GET_TASK_AWARD_NEW>('get_task_award_new', { id: taskid, award_progress_lv: level });
}

// ========================================= 奖励领取状态（多阶段任务）
export type RES_TASK_AWARD_STATUS = {
  result?: Array<0 | 1 | 2>;
};
/**
 * 获取某个任务各阶段的奖励领取状态
 * @param id 任务ID
 * @param count 任务有共有几个阶段
 * @returns
 */
export function API_TASK_AWARD_STATUS(id: number, count: number) {
  if (isWebview)
    return fetchMessage<RES_TASK_AWARD_STATUS>(
      `unityfun://decode_all_task_award_status?1_int=${id}&2_int=${count}`,
      true
    )!;
  else
    console.log(
      '浏览器环境不支持获取某个任务各阶段的奖励领取状态',
      `unityfun://decode_all_task_award_status?1_int=${id}`
    );
}

// ========================================= 超值月卡

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
  return fetchCall<RES_QUERY_NEW_YUEKA_BASE_INFO>('query_new_yueka_base_info');
}

/**
 * 购买尊享月卡后，领取每日奖励
 */
export function API_NEW_YUEKA_RECEIVE_AWARD() {
  return fetchCall<Record<'result', number>>('new_yueka_receive_award');
}

// ========================================= 至尊季卡

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
  return fetchCall<RES_QUERY_JIKA_BASE_INFO>('query_jika_base_info');
}
/**
 * 每日抽奖返回数据
 */
type RES_JIKA_EVERYDAY_LOTTERY = {
  /** 0 成功 */
  result: number;
  /** 奖励名称 */
  award_name: string;
  /** 奖励ID */
  award_id: number;
  /** 玩家昵称 */
  name: string;
};
/**
 * 每日抽奖
 * @returns
 */
export function API_JIKA_EVERYDAY_LOTTERY() {
  return fetchCall<RES_JIKA_EVERYDAY_LOTTERY>('jika_everyday_lottery');
}

// ========================================= 系统升级奖励

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
  return fetchCall<RES_GET_TASK_AWARD>('get_task_award', { id });
}

// ========================================= 全返礼包

type ALL_RETURN_LB_DATA = {
  /** 是否购买 */
  is_buy: number;
  /** 剩余次数 */
  remain_num: number;
  /** 购买时间 */
  buy_time: number;
  /** 任务过期时间 */
  over_time: number;
};
type RES_QUERY_ALL_RETURN_LB_INFO = {
  result: number;
  all_return_lb_1: ALL_RETURN_LB_DATA;
  all_return_lb_2: ALL_RETURN_LB_DATA;
  all_return_lb_3: ALL_RETURN_LB_DATA;
};
/**
 * 请求全返礼包数据
 * @returns
 */
export function API_QUERY_ALL_RETURN_LB_INFO() {
  return fetchCall<RES_QUERY_ALL_RETURN_LB_INFO>('query_all_return_lb_info');
}

// ========================================= 每日特惠

// ========================================= 一本万利
