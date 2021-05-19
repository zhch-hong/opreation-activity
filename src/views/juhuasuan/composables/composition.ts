import { fetchClientConfig, fetchCall } from '@/network';
import { ref, watch } from 'vue';
import { triggerUpdate } from './notify';

const priceList = fetchClientConfig('');
const activePrice = ref<number | null>(null);
const activePricedata = ref<Record<string, unknown> | null>(null);

const firstEnable = ref(true);
const twoceEnable = ref(true);
const tenEnable = ref(true);

/**
 * 点击购买时的礼包ID
 */
const currentID = ref<number | null>(null);

let countdownTimer = -1;
const countdown = ref(0);

function statusUpdate(params: number | string) {
  const priceData = priceList.value.find((item) => item['price|价格'] === params);
  if (priceData) {
    activePricedata.value = priceData;

    fetchCall<Record<string, unknown>>({
      name: 'query_gift_bag_status',
      data: {
        gift_bag_id: Number((priceData['shop_id|商品ID'] as string).split(',')[0]),
      },
    }).then((o) => {
      fetchCall<Record<string, unknown>>({
        name: 'query_gift_bag_status',
        data: {
          gift_bag_id: Number((priceData['shop_id|商品ID'] as string).split(',')[2]),
        },
      }).then((t) => {
        fetchCall<Record<string, unknown>>({
          name: 'query_gift_bag_status',
          data: {
            gift_bag_id: Number((priceData['shop_id|商品ID'] as string).split(',')[1]),
          },
        }).then((e) => {
          // 是否能够买的状态
          firstEnable.value = o.remain_time === 1;

          if (t.remain_time === 0 || e.remain_time === 0) {
            twoceEnable.value = false;
            tenEnable.value = false;
            setCountdown(0); // 倒计时
          } else {
            twoceEnable.value = true;
            tenEnable.value = true;
            setCountdown(Number.parseInt((o.time as number | string).toString())); // 倒计时
          }

          // 设置当前购买的礼包ID
          if (o.remain_time === 1) {
            // remain_time为1说明第一个礼包能购买
            currentID.value = o.gift_bag_id as number;
          } else if (countdown.value > 0) {
            // 倒计时大于0说明，第一个已经买了，并且没有超过10分钟
            currentID.value = e.gift_bag_id as number;
          } else {
            currentID.value = t.gift_bag_id as number;
          }
        });
      });
    });

    // const promiseOne = fetchCall<Record<string, unknown>>({
    //   name: 'query_gift_bag_status',
    //   data: {
    //     gift_bag_id: Number((priceData['shop_id|商品ID'] as string).split(',')[0]),
    //   },
    // }).then((data) => data);

    // const promiseTwo = fetchCall<Record<string, unknown>>({
    //   name: 'query_gift_bag_status',
    //   data: {
    //     gift_bag_id: Number((priceData['shop_id|商品ID'] as string).split(',')[2]),
    //   },
    // }).then((data) => data);

    // const promiseTen = fetchCall<Record<string, unknown>>({
    //   name: 'query_gift_bag_status',
    //   data: {
    //     gift_bag_id: Number((priceData['shop_id|商品ID'] as string).split(',')[1]),
    //   },
    // }).then((data) => data);

    // // 将第二次十分钟之内和十分钟之外两个ID同时请求下来，只要有一个购买了，就是明日购买
    // Promise.all<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>([
    //   promiseOne,
    //   promiseTwo,
    //   promiseTen,
    // ]).then(([o, t, e]) => {
    //   console.log('礼包状态');
    //   console.log('o', o);
    //   console.log('t', t);
    //   console.log('e', e);

    //   // 是否能够买的状态
    //   firstEnable.value = o.remain_time === 1;

    //   if (t.remain_time === 0 || e.remain_time === 0) {
    //     twoceEnable.value = false;
    //     tenEnable.value = false;
    //     setCountdown(0); // 倒计时
    //   } else {
    //     twoceEnable.value = true;
    //     tenEnable.value = true;
    //     setCountdown(Number.parseInt((o.time as number | string).toString())); // 倒计时
    //   }

    //   // 设置当前购买的礼包ID
    //   if (o.remain_time === 1) {
    //     // remain_time为1说明第一个礼包能购买
    //     currentID.value = o.gift_bag_id as number;
    //   } else if (countdown.value > 0) {
    //     // 倒计时大于0说明，第一个已经买了，并且没有超过10分钟
    //     currentID.value = e.gift_bag_id as number;
    //   } else {
    //     currentID.value = t.gift_bag_id as number;
    //   }
    // });
  }
}

/**
 * 计算倒计时
 * @param params
 * @returns
 */
function setCountdown(params: number) {
  const diff = USER.value?.diff as number;
  const cd = params + 600 + diff - Math.floor(new Date().valueOf() / 1000);
  if (cd > 0) {
    countdown.value = cd;
    countdownInterval();
  } else {
    countdown.value = 0;
  }
}

/**
 * 每隔1秒更新倒计时数值
 */
function countdownInterval() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  countdownTimer = window.setInterval(() => {
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      return;
    }

    countdown.value--;
  }, 1000);
}

export default function listener() {
  watch(
    () => priceList,
    (params) => {
      if (params.value.length === 0) return;
      activePrice.value = params.value[0]['price|价格'] as number;
    },
    {
      deep: true,
      immediate: true,
    }
  );

  watch(
    activePrice,
    (params) => {
      if (params) {
        statusUpdate(params);
      }
    },
    { immediate: true }
  );

  watch(triggerUpdate, () => {
    if (activePrice.value) {
      statusUpdate(activePrice.value);
    }
  });
}

export { priceList, activePrice, activePricedata, firstEnable, twoceEnable, tenEnable, countdown, currentID };
