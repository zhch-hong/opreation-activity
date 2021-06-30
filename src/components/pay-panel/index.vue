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
import { fetchCall, fetchMessage } from '@/network';
import { isBrowser } from '@/runtime-env';
import alertMessage from '@/components/alert';

import OverlayDialog from '../overlay-dialog/index.vue';

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
      weixin: true,
      alipay: true,
      unionpay: true,
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
    console.log('created');

    this.fetchPayType();
  },

  methods: {
    fetchPayType() {
      fetchCall<Record<'types', Record<string, string>[]>>({
        name: 'get_pay_types',
        data: {
          goods_id: this.giftid,
        },
      }).then(({ types }) => {
        this.paytypes = types.filter((o) => ['wxgzh', 'alipay', 'UnionPay'].includes(o.channel));
      });
    },

    createOrder(value: string) {
      fetchCall<Record<string, unknown>>({
        name: 'create_pay_order',
        data: {
          goods_id: this.giftid,
          channel_type: value,
          geturl: 'y',
          convert: undefined,
        },
      }).then((data) => {
        if (data.result !== 0) {
          alertMessage(`[${data.result}]创建订单失败`);
          return;
        }

        this.$emit('unmount');

        let url = data.url as string;
        const orderID = data.order_id as string;
        url = url.replace('@order_id@', orderID);

        const type = this.paytypes.find((item) => item.channel === value);
        if (type) {
          url = url.replace('@child_channel@', type.child_channel);
        }
        if (isBrowser) {
          window.open(url);
        } else {
          fetchMessage(`unityfun://openurl?1_url=${encodeURIComponent(url)}`, false);
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
