<template>
  <OverlayDialog :visible="true" @close="$emit('unmount')">
    <template #title>
      <span>支付方式</span>
    </template>
    <div class="main">
      <div class="select">
        <div class="price">￥{{ price }}</div>
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
import { API_CREATE_PAY_ORDER, API_GET_PAY_TYPES, API_OPEN_BROWSER } from '@/vendors/api';

export default defineComponent({
  name: 'PayPanel',

  components: {
    OverlayDialog,
  },

  props: {
    giftid: Number,
    price: Number,
  },

  emits: ['unmount'],

  data() {
    return {
      weixin: false,
      alipay: false,
      unionpay: false,
      paytypes: [] as Record<string, string>[],
    };
  },

  watch: {
    paytypes(types: Record<string, string>[]) {
      this.weixin = types.find((el) => el.channel === 'weixin') ? true : false;
      this.alipay = types.find((el) => el.channel === 'alipay') ? true : false;
      this.unionpay = types.find((el) => el.channel === 'UnionPay') ? true : false;
    },
  },

  created() {
    this.fetchPayType();
  },

  methods: {
    fetchPayType() {
      if (!this.giftid) return;
      API_GET_PAY_TYPES(this.giftid).then(({ types }) => {
        if (!types) return;
        this.paytypes = types.filter((o) => ['wxgzh', 'alipay', 'UnionPay'].includes(o.channel));
      });
    },

    createOrder(value: string) {
      if (!this.giftid) return;

      API_CREATE_PAY_ORDER(this.giftid, value).then(({ order_id, result, url }) => {
        if (result !== 0) {
          alertMessage(`[${result}]创建订单失败`);
          return;
        }

        this.$emit('unmount');

        url = url.replace('@order_id@', order_id);
        const type = this.paytypes.find((item) => item.channel === value);
        if (type) {
          url = url.replace('@child_channel@', type.child_channel);
        }

        if (isWebview) {
          API_OPEN_BROWSER(url);
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
