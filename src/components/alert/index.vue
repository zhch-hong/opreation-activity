<template>
  <OverlayDialog :visible="true" @close="visible = false">
    <template #title>
      <span>提示</span>
    </template>
    <div class="main">
      <p class="message">{{ message }}</p>
      <button class="button" @click="$emit('close')"></button>
    </div>
  </OverlayDialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import OverlayDialog from '../overlay-dialog/index.vue';

export default defineComponent({
  components: { OverlayDialog },

  props: {
    message: String,
  },

  emits: ['close'],
});
</script>

<style lang="scss" scoped src="./index.scss" />
