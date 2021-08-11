<template>
  <div class="zunxiang">
    <!-- 剩余天数 -->
    <span class="count">{{ count }}</span>

    <!-- 已购买的遮罩 -->
    <div v-if="!enable" class="jinbi-overlay">
      <img class="yilingquicon" src="../../image/yk_icon_ylq.png" alt="已领取" />
    </div>

    <!-- 购买 -->
    <div v-if="enable" class="buy" @click="submit"></div>

    <!-- 立即领取 -->
    <div v-if="!enable && !lingqu" class="lijilingqu" @click="onclickLingqu"></div>
    <!-- 已领取 -->
    <div v-if="!enable && lingqu" class="yilingqu"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import _ from 'lodash';
import { ZXYUEKA } from '@/vendors/shopping';
import payPanel from '@/components/pay-panel';
import { API_NEW_YUEKA_RECEIVE_AWARD, RES_QUERY_NEW_YUEKA_BASE_INFO } from '@/vendors/api';

export default defineComponent({
  name: '尊享月卡',

  props: {
    baseData: {
      required: true,
      type: Object as PropType<RES_QUERY_NEW_YUEKA_BASE_INFO>,
    },
  },

  setup(props) {
    const count = ref(30);
    const enable = ref(true);
    const lingqu = ref(false);

    watch(
      () => props.baseData,
      (object) => {
        if (!_.isEmpty(object)) {
          if (object.total_remain_num_2 === 0) {
            count.value = 30;
            enable.value = true;
          } else {
            count.value = object.total_remain_num_2;
            enable.value = false;

            if (object.is_receive_2 === 0) lingqu.value = false;
            else lingqu.value = true;
          }
        }
      },
      { immediate: true }
    );

    return {
      count,
      enable,
      lingqu,
    };
  },

  methods: {
    submit() {
      payPanel(ZXYUEKA.id, ZXYUEKA.price);
    },

    onclickLingqu() {
      API_NEW_YUEKA_RECEIVE_AWARD();
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
