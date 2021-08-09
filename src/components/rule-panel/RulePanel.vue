<template>
  <OverlayDialog @close="$emit('unmount')">
    <template #title>
      <span>说明</span>
    </template>
    <ul class="rule">
      <li v-for="(r, i) of ruleList" :key="i">{{ ++i }}.{{ r }}</li>
    </ul>
  </OverlayDialog>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import OverlayDialog from '@/components/overlay-dialog/index.vue';

export default defineComponent({
  name: '规则说明',

  components: { OverlayDialog },

  props: {
    ruleList: Array as PropType<string[]>,
  },

  emits: ['unmount'],
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
