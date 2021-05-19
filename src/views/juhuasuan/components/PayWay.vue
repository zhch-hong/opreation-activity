<template>
  <teleport to="#app">
    <!-- 遮罩 -->
    <div v-center class="pay-way" :style="{ display: visible }">
      <!-- 居中主体 -->
      <div class="main">
        <!-- 标题 -->
        <div class="title"><span>支付方式</span></div>
        <!-- 关闭按钮 -->
        <button class="close" @click="$emit('update:visible', 'none')"></button>
        <!-- 支付宝 微信 云闪付 -->
        <div class="select">
          <div class="price">￥{{ activePrice }}</div>
          <div class="types">
            <div v-if="wxgzh" v-center class="pay wx" @click="createOrder('wxgzh')"></div>
            <div v-if="alipay" v-center class="pay zfb" @click="createOrder('alipay')"></div>
            <div v-if="UnionPay" v-center class="pay ysf" @click="createOrder('UnionPay')"></div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { fetchCall } from '@/network';
import { defineComponent, ref, watch } from 'vue';
import { currentID, activePrice } from '../composables/composition';
import { isBrowser } from '@/runtime-env';

export default defineComponent({
  name: 'PayWay',

  props: ['types', 'visible'],

  emits: ['update:visible'],

  setup(props) {
    const wxgzh = ref(false);
    const alipay = ref(false);
    const UnionPay = ref(false);

    watch(
      () => props.types,
      (types: Record<string, string>[]) => {
        wxgzh.value = types.find((el) => el.channel === 'wxgzh') ? true : false;
        alipay.value = types.find((el) => el.channel === 'alipay') ? true : false;
        UnionPay.value = types.find((el) => el.channel === 'UnionPay') ? true : false;
      }
    );

    return {
      wxgzh,
      alipay,
      UnionPay,
      activePrice,
    };
  },

  methods: {
    createOrder(value: string) {
      fetchCall<Record<string, unknown>>({
        name: 'create_pay_order',
        data: {
          goods_id: currentID.value,
          channel_type: value,
          geturl: 'y',
          convert: undefined,
        },
      }).then((data) => {
        this.$emit('update:visible', 'none');

        let url = data.url as string;
        const orderID = data.order_id as string;
        url = url.replace('@order_id@', orderID);

        const type = (this.types as Record<string, string>[]).find((item) => item.channel === value);
        if (type) {
          url = url.replace('@child_channel@', type.child_channel);
        }

        if (isBrowser) {
          window.open(url);
        } else {
          // 通过客户端调浏览器打开URL
          location.href = `unityfun://openurl?1_url=${encodeURIComponent(url)}`;
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped>
div.pay-way {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  // background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.8), transparent);
}

div.main {
  position: relative;
  width: 942px;
  height: 590px;
  background-image: url('../../../assets/image/bg_1.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

div.title {
  position: absolute;
  text-align: center;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 554px;
  height: 105px;
  line-height: 105px;
  background: url('../../../assets/image/title_back.png') no-repeat center/contain;
  font-size: 46px;
  font-weight: 600;
  color: rgb(235, 177, 37);
}

button.close {
  position: absolute;
  right: -16px;
  top: -16px;
  outline: none;
  border: none;
  width: 104px;
  height: 104px;
  background: url('../../../assets/image/gb_1.png') no-repeat center/contain;
}

div.select {
  position: absolute;
  left: 40px;
  right: 40px;
  bottom: 46px;
  top: 130px;
  background-color: #f9f5e6;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  div.price {
    background-color: #eae4cf;
    border-radius: 10px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-size: 40px;
    font-weight: 600;
    color: #b98109;
    width: 600px;
  }

  div.types {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 200px;

    div.pay {
      width: 254px;
      height: 260px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }

    div.wx {
      background-image: url('../../../assets/image/pay_btn_wechat.png');
    }

    div.zfb {
      background-image: url('../../../assets/image/pay_btn_alipay.png');
    }

    div.ysf {
      background-image: url('../../../assets/image/pay_btn_Unionpay.png');
    }
  }
}
</style>
