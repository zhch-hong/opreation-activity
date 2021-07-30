<template>
  <div class="haohua">
    <img class="ques" src="@/assets/image/qs.png" alt="奖励领取" @click="showTips" />

    <!-- 剩余天数 -->
    <span class="count">{{ count }}</span>

    <!-- 已购买的遮罩 -->
    <div v-if="!enable" class="jinbi-overlay">
      <img class="yilingqu" src="../../image/yk_icon_ylq.png" alt="已领取" />
    </div>

    <!-- 点击问号显示/隐藏救济金说明 -->
    <img v-if="quesShow" class="jiujijin" src="../../image/yk_bg_2.png" alt="救济金" />

    <!-- 立即领取 -->
    <div v-if="enable" class="buy" @click="submit"></div>

    <!-- 已购买 -->
    <div v-if="!enable" class="yigoumai"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import _ from 'lodash';
import { HHYUEKA } from '@/shopping';
import payPanel from '@/components/pay-panel';
import { RES_QUERY_NEW_YUEKA_BASE_INFO } from '@/api';

export default defineComponent({
  name: '豪华月卡',

  props: {
    baseData: {
      required: true,
      type: Object as PropType<RES_QUERY_NEW_YUEKA_BASE_INFO>,
    },
  },

  setup(props) {
    const count = ref(30);
    const enable = ref(true);

    watch(
      () => props.baseData,
      (object) => {
        if (!_.isEmpty(object)) {
          if (object.total_remain_num_1 === 0) {
            count.value = 30;
            enable.value = true;
          } else {
            count.value = object.total_remain_num_1;
            enable.value = false;
          }
        }
      },
      { immediate: true }
    );

    return {
      count,
      enable,
      quesShow: ref(false),
    };
  },

  methods: {
    submit() {
      payPanel(HHYUEKA.id, HHYUEKA.price);
    },

    showTips() {
      this.quesShow = true;

      setTimeout(() => {
        document.addEventListener(
          'click',
          () => {
            this.quesShow = false;
          },
          { once: true }
        );
      }, 100);
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
