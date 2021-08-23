<template>
  <OverlayDialog :visible="visible" @close="visible = false">
    <template #title>
      <span>支付方式</span>
    </template>
    <div class="main">
      <div class="select">
        <div class="price">￥{{ giftPrice }}</div>
        <div class="types">
          <div v-if="weixin" class="pay wx" @click="createOrder('weixin')"></div>
          <div v-if="alipay" class="pay zfb" @click="createOrder('alipay')"></div>
          <div v-if="unionpay" class="pay ysf" @click="createOrder('UnionPay')"></div>
        </div>
      </div>
    </div>
  </OverlayDialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { isWebview } from '@/vendors/runtime-env';
import alertMessage from '@/components/alert';

import OverlayDialog from '../overlay-dialog/index.vue';
import { API_CREATE_PAY_ORDER, API_OPEN_BROWSER } from '@/vendors/api';
import { GIFT_ID, GIFT_PRICE, VISIBILITY, WEIXIN, ALIPAY, UNIONPAY } from '.';

export default defineComponent({
  name: 'PayPanel',

  components: {
    OverlayDialog,
  },

  setup() {
    return {
      giftId: GIFT_ID,
      giftPrice: GIFT_PRICE,
      visible: VISIBILITY,
      weixin: WEIXIN,
      alipay: ALIPAY,
      unionpay: UNIONPAY,
    };
  },

  methods: {
    createOrder(value: string) {
      if (!this.giftId) return;

      API_CREATE_PAY_ORDER(this.giftId, value).then(({ order_id, result, url }) => {
        if (result !== 0) {
          alertMessage(`[${result}]创建订单失败`);
          return;
        }

        url = url.replace('@order_id@', order_id).replace('@child_channel@', 'Native');
        if (isWebview && process.env.NODE_ENV === 'production') {
          API_OPEN_BROWSER(url);
        }

        this.visible = false;
      });
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
