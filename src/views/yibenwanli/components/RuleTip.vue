<template>
  <OverlayDialog :visible="visible" :show-close="true" @close="$emit('close')">
    <template #title>
      <span>提示</span>
    </template>
    <div style="padding: 8px; color: #b98109">
      <p style="margin: 0 0 8px 0">一本万利规则：</p>
      <ul>
        <li>1.购买一本万利后，即激活礼包任务。</li>
        <li>2.每期共有8个礼包可购买，其中王者与荣耀礼包可多次购买，其余礼包每个周期（十天）限购一次。</li>
        <li>3.可同时购买激活所有礼包，获得最大收益。</li>
        <li>4.每个礼包在购买激活后才会累计任务进度。</li>
        <li>5.苹果大战不计入数据统计。</li>
      </ul>
    </div>
  </OverlayDialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import OverlayDialog from '@/components/overlay-dialog/index.vue';

export default defineComponent({
  components: { OverlayDialog },

  emits: ['close'],

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
<style scoped>
li {
  margin-top: 10px;
}
</style>
