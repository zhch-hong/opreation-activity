import { API_GET_PAY_TYPES } from '@/vendors/api';
import { createApp, ref } from 'vue';
import alertMsg from '../alert';

import PayPanel from './index.vue';

const GIFT_ID = ref(-1);
const GIFT_PRICE = ref(-1);
const VISIBILITY = ref(false);

const WEIXIN = ref(false);
const ALIPAY = ref(false);
const UNIONPAY = ref(false);

let isMounted = false;

const app = createApp(PayPanel);

function payPanel(giftId: number, giftPrice: number) {
  GIFT_ID.value = giftId;
  GIFT_PRICE.value = giftPrice;

  API_GET_PAY_TYPES(giftId).then(({ types }) => {
    if (typeof types === 'undefined') {
      alertMsg('请求支付方式失败');
    } else {
      WEIXIN.value = types.findIndex((t) => t.channel === 'weixin') === -1 ? false : true;
      ALIPAY.value = types.findIndex((t) => t.channel === 'alipay') === -1 ? false : true;
      UNIONPAY.value = types.findIndex((t) => t.channel === 'UnionPay') === -1 ? false : true;

      if (isMounted) {
        VISIBILITY.value = true;
      } else {
        const div = document.createElement('div');
        document.querySelector('#app')?.append(div);
        app.mount(div).$nextTick(() => {
          VISIBILITY.value = true;
          isMounted = true;
          div.remove();
        });
      }
    }
  });
}

export { GIFT_ID, GIFT_PRICE, VISIBILITY, WEIXIN, ALIPAY, UNIONPAY };
export default payPanel;
