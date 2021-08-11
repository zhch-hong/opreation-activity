import _ from 'lodash';
import { onMounted, onUnmounted } from 'vue';
import assetNotify, { notifyValidate } from '../components/asset-notify';
import { registerServeMsg, unregisterServeMsg } from './network';
import { RES_QUERY_CHANG_WAN_KA_BASE_INFO, T_TASK_DATA } from './api';

// ========================================= 订单状态改变
export type RES_NOTIFY_PAY_ORDER_MSG = {
  goods_id: number;
  money: number;
  order_id: string;
  result: number;
};
/**
 * 订单消息
 * @param callback
 */
export function SKT_NOTIFY_PAY_ORDER_MSG(callback: (params: RES_NOTIFY_PAY_ORDER_MSG) => void) {
  const message = 'notify_pay_order_msg';

  onMounted(() => {
    registerServeMsg<RES_NOTIFY_PAY_ORDER_MSG>(message, (event) => {
      callback(event);
    });
  });

  onUnmounted(() => {
    unregisterServeMsg(message);
  });
}

// ========================================= 任务状态改变
type T_TASK_CHANGE_MSG = {
  task_item: T_TASK_DATA;
};
/**
 * 任务状态改变消息
 * @param callback
 */
export function SKT_TASK_CHANGE_MSG(callback: (params: T_TASK_CHANGE_MSG) => void) {
  const message = 'task_change_msg';

  onMounted(() => {
    registerServeMsg<T_TASK_CHANGE_MSG>(message, (event) => {
      callback(event);
    });
  });

  onUnmounted(() => {
    unregisterServeMsg(message);
  });
}

// ========================================= 资产改变
type T_ASSET = {
  asset_type: string;
  asset_value: number;
  attribute?: string;
};
type T_NOTIFY_ASSET_CHANGE_MSG = {
  change_asset: T_ASSET[];
  no: number;
  type: string;
};
/**
 * 资产改变消息
 * @param callback
 */
export function SKT_NOTIFY_ASSET_CHANGE_MSG(callback?: (data: T_NOTIFY_ASSET_CHANGE_MSG) => void) {
  const message = 'notify_asset_change_msg';

  onMounted(() => {
    registerServeMsg<T_NOTIFY_ASSET_CHANGE_MSG>(message, (params) => {
      const asset = params.change_asset;
      const filtAsset = asset
        .filter((item) => {
          if (item.asset_type.startsWith('obj_')) {
            if (typeof item.attribute !== 'undefined') {
              return true;
            }
          } else {
            if (_.toNumber(item.asset_value) > 0) {
              return true;
            }
          }
        })
        .map((item) => ({ name: item.asset_type, count: _.toNumber(item.asset_value) }));

      const type = params.type as string;

      if (notifyValidate(type)) {
        assetNotify(filtAsset);
      }

      callback && callback(params);
    });
  });

  onUnmounted(() => {
    unregisterServeMsg(message);
  });
}

// ========================================= 季卡信息改变
type T_JIKA_CHANGE = {
  buy_time: number;
  is_lottery: number;
  total_remain_num: number;
};
/**
 * 季卡基本信息改变
 * @param callback
 * @returns
 */
export function SKT_JIKA_BASE_INFO_CHANGE_MSG(callback: (data: T_JIKA_CHANGE) => void) {
  const message = 'jika_base_info_change_msg';

  onMounted(() => {
    registerServeMsg<T_JIKA_CHANGE>(message, callback);
  });

  onUnmounted(() => {
    unregisterServeMsg(message);
  });
}

// ========================================= 畅玩卡信息改变
export function SKT_QUERY_CHANG_WAN_KA_BASE_INFO(callback: (data: RES_QUERY_CHANG_WAN_KA_BASE_INFO) => void) {
  const message = 'query_chang_wan_ka_base_info';
  onMounted(() => {
    registerServeMsg<RES_QUERY_CHANG_WAN_KA_BASE_INFO>(message, callback);
  });

  onUnmounted(() => {
    unregisterServeMsg(message);
  });
}
