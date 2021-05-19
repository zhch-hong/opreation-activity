<template>
  <div v-bind="$attrs" v-center>
    <div class="limit-time">
      <div class="left">
        <p>两次购买间隔在10分钟内再送以下奖励</p>
        <p>
          间隔倒计时：<span class="countdown">{{ ms }}</span>
        </p>
      </div>
      <div v-center class="center">
        <div class="back">
          <img class="zeng" src="@/assets/image/jhs_icon_1.png" alt="赠" />
          <img class="jingbi" src="@/assets/image/ty_icon_jb_6y.png" alt="金币" />
          <span>x{{ count }}</span>
        </div>
      </div>
      <div v-center class="right">
        <button v-if="enable" class="enable" @click="handleBuy"></button>
        <button v-else class="disable"></button>
      </div>
    </div>
  </div>
  <PayWay :types="payWays" :visible="paywayVisible" @update:visible="(b) => (paywayVisible = b)" />
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { countdown, currentID } from '../composables/composition';
import { fetchCall } from '@/network';

import PayWay from './PayWay.vue';

export default defineComponent({
  name: 'LimitTime',

  components: { PayWay },

  props: ['enable', 'count', 'time'],

  setup() {
    const ms = ref('');
    const paywayVisible = ref<'flex' | 'none'>('none');

    watch(
      countdown,
      (value) => {
        const m = Math.floor(value / 60);
        const s = value % 60;
        const _m = m < 10 ? `0${m}` : m.toString();
        const _s = s < 10 ? `0${s}` : s.toString();
        ms.value = `${_m}:${_s}`;
      },
      { immediate: true, deep: true }
    );

    return {
      ms,
      paywayVisible,
    };
  },

  data() {
    return {
      payWays: [] as Record<string, string>[],
    };
  },

  methods: {
    handleBuy() {
      fetchCall<Record<string, unknown>>({
        name: 'get_pay_types',
        data: {
          goods_id: currentID.value,
        },
      }).then((data) => {
        this.payWays = (data.types as Record<string, string>[]).filter((o) =>
          ['wxgzh', 'alipay', 'UnionPay'].includes(o.channel)
        );
        this.paywayVisible = 'flex';
      });
    },
  },
});
</script>

<style lang="scss" scoped>
div.limit-time {
  width: 916px;
  height: 188px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  background: url('../../../assets/image/jhs_bg_5.png') no-repeat;
  background-size: contain;

  div.left {
    flex-grow: 1;
    color: #fff;
    font-size: 32px;
    p {
      line-height: 1.4;
      margin: 4px 0;
    }
    span.countdown {
      position: relative;
      left: -10px;
      top: 3px;
      font-size: 36px;
      color: #df1c1c;
    }
  }

  div.center {
    width: 200px;
    div.back {
      position: relative;
      width: 144px;
      height: 141px;
      background-image: url('../../../assets/image/jhs_bg_6.png');
      background-size: contain;
      img.zeng {
        position: absolute;
        width: 85px;
        height: 66px;
        left: -18px;
        top: -40px;
      }
      img.jingbi {
        width: 100px;
        height: 100px;
        margin-left: 20px;
      }
      span {
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 28px;
        color: #fff;
      }
    }
  }

  div.right {
    width: 300px;

    button {
      outline: none;
      border: unset;
      background: unset;
    }

    button.enable {
      width: 233px;
      height: 99px;
      background: url('../../../assets/image/jhs_btn_ljgm.png') no-repeat;
      background-size: contain;
    }

    button.disable {
      width: 236px;
      height: 90px;
      background: url('../../../assets/image/jhs_bg_mrkg.png') no-repeat;
      background-size: contain;
    }
  }
}
</style>
