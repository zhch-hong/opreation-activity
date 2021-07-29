<template>
  <div class="zhizunjika">
    <div class="yueka">
      <div class="overlay">
        <img class="yilingquicon" src="../../image/yk_icon_ylq.png" alt="已领取" />
      </div>
      <span class="count">{{ count }}</span>

      <!-- 已领取 -->
      <div v-if="isLingqu" class="yilingqu"></div>
      <!-- 领取 -->
      <div v-else class="lingqu" @click="submit"></div>
    </div>
    <div class="jika">
      <div class="lingqu"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { API_NEW_YUEKA_RECEIVE_AWARD, RES_QUERY_NEW_YUEKA_BASE_INFO } from '@/api';
import _ from 'lodash';

export default defineComponent({
  name: '至尊季卡',

  props: {
    baseData: {
      required: true,
      type: Object as PropType<RES_QUERY_NEW_YUEKA_BASE_INFO>,
    },
  },

  setup(props) {
    const isLingqu = ref(false);
    const count = ref(30);

    watch(
      () => props.baseData,
      (object) => {
        if (!_.isEmpty(object)) {
          isLingqu.value = object.is_receive_2 !== 0;
          count.value = object.total_remain_num_2;
        }
      },
      { immediate: true }
    );

    return {
      isLingqu,
      count,
    };
  },

  methods: {
    submit() {
      API_NEW_YUEKA_RECEIVE_AWARD();
    },
  },
});
</script>
<style lang="scss" scoped src="./index.scss" />
