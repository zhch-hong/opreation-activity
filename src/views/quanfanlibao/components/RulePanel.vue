<template>
  <OverlayDialog :visible="visible" @close="$emit('close')">
    <template #title>
      <span>说明</span>
    </template>
    <ul class="rule">
      <li>1.购买后立得指定金币数，并激活奖金任务</li>
      <li>2.任务有效期内，每天完成任务可领取1次奖励，超时未完成，视为放弃</li>
      <li>3.不同种类的礼包可叠加购买领奖</li>
    </ul>
  </OverlayDialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import OverlayDialog from '@/components/overlay-dialog/index.vue';

export default defineComponent({
  name: '规则说明',

  components: { OverlayDialog },

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['close'],
});
</script>
<style lang="scss" scoped>
.rule {
  padding: 20px;
  color: rgb(185, 129, 9);

  li {
    margin-bottom: 10px;
  }
}
</style>
