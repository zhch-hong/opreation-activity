<template>
  <div class="container">
    <!-- 关闭按钮 -->
    <a class="close" href="uniwebviewfun://Hide">
      <img src="@/assets/image/close_3.png" alt="关闭" />
    </a>

    <LuckyWheel :is-lottery="isLottery" :is-buyed="isBuyed" @lottery-resolve="lotteryResolve" @pay-panel="handlePay" />

    <!-- 规则 -->
    <RulePanel />

    <template v-if="isBuyed">
      <template v-if="showQuanfan">
        <div class="box-2">
          <img class="img-1" src="./image/zzjk_icon_1.png" alt="猜你喜欢" />
          <img class="img-2" src="./image/zzjk_icon_10.png" alt="季返礼包" />
          <img class="img-3" src="./image/zzjk_icon_11.png" alt="待领取100元" />
          <img class="img-4" src="@/assets/image/zzjk_icon_4.png" alt="立即领取" />
        </div>
      </template>
      <template v-else>
        <!-- 金币880万，抽奖券90 -->
        <div class="box-1">
          <div class="item">
            <img src="@/assets/image/zzjk_icon_3.png" alt="880万金币" />
            <span>金币 x880万</span>
            <img class="icon" src="./image/yihuode.png" alt="已获得" />
          </div>
          <div class="item">
            <img src="./image/zzjk_icon_2.png" alt="880万金币" />
            <span>抽奖券 x90</span>
            <img class="icon" src="./image/yihuode.png" alt="已获得" />
          </div>
        </div>
      </template>

      <div class="box-3">
        <span>剩余奖券：</span>
        <img src="@/assets/image/com_award_icon_dhq.png" alt="奖券" />
        <span>x{{ count }}</span>
      </div>

      <p class="tip">（奖券每日24点自动扣除1张，请您及时使用）</p>
    </template>
    <template v-else>
      <!-- 购买立得 -->
      <img class="img-1" src="./image/zzjk_icon_9.png" alt="购买立得" />

      <!-- 金币880万，抽奖券90 -->
      <div class="box-1">
        <div class="item">
          <img src="@/assets/image/zzjk_icon_3.png" alt="880万金币" />
          <span>金币 x880万</span>
          <!-- <img v-if="!showQuanfan" class="icon" src="./image/yihuode.png" alt="已获得" /> -->
        </div>
        <div class="item">
          <img src="./image/zzjk_icon_2.png" alt="880万金币" />
          <span>抽奖券 x90</span>
          <!-- <img v-if="!showQuanfan" class="icon" src="./image/yihuode.png" alt="已获得" /> -->
        </div>
      </div>

      <!-- 不划算包退 -->
      <img class="img-2" src="./image/zzjk_icon_8.png" alt="立即领取不划算包退" />

      <!-- 198元领取 -->
      <img class="img-3" src="./image/zzjk_icon_7.png" alt="198元领取" @click="handlePay" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { ZHIZUNJIKA } from '@/vendors/shopping';
import { API_QUERY_JIKA_BASE_INFO, API_QUERY_ALL_RETURN_LB_INFO } from '@/vendors/api';
import { SKT_JIKA_BASE_INFO_CHANGE_MSG, SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/vendors/api-socket';
import payPanel from '@/components/pay-panel';

import RulePanel from './components/RulePanel.vue';
import LuckyWheel from './components/lucky-wheel/LuckyWheel.vue';

type JIKA_CHANGE = {
  buy_time: number;
  is_lottery: number;
  total_remain_num: number;
};

export default defineComponent({
  components: { RulePanel, LuckyWheel },

  setup() {
    SKT_NOTIFY_ASSET_CHANGE_MSG();

    const isBuyed = ref(false);
    const isLottery = ref(false);
    const count = ref(0);
    const showQuanfan = ref(false);

    const fetchStatus = () => {
      API_QUERY_JIKA_BASE_INFO().then(({ total_remain_num, is_lottery }) => {
        isBuyed.value = total_remain_num > 0;
        count.value = total_remain_num;
        isLottery.value = is_lottery === 1;
      });
    };

    onBeforeMount(() => {
      fetchStatus();

      API_QUERY_ALL_RETURN_LB_INFO().then(({ all_return_lb_3 }) => {
        const { is_buy } = all_return_lb_3;
        showQuanfan.value = is_buy === 0;
      });
    });

    SKT_JIKA_BASE_INFO_CHANGE_MSG(({ total_remain_num, is_lottery }) => {
      isBuyed.value = total_remain_num > 0;
      count.value = total_remain_num;
      isLottery.value = is_lottery === 1;
    });

    return {
      isBuyed,
      isLottery,
      count,
      fetchStatus,
      showQuanfan,
    };
  },

  methods: {
    handlePay() {
      payPanel(ZHIZUNJIKA.id, ZHIZUNJIKA.price);
    },

    lotteryResolve(event: unknown) {
      console.log('抽奖结束', event);
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
