<template>
  <teleport to="#app">
    <van-overlay v-center :show="visible" :custom-style="customStyle" duration="0">
      <div class="wrapper">
        <img class="close" src="@/assets/image/gb_1.png" alt="关闭" @click="close" />
        <div class="header">
          <slot name="title" />
        </div>
        <div class="content">
          <slot />
        </div>
      </div>
    </van-overlay>
  </teleport>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'OverlayDialog',

  props: {
    visible: Boolean,
  },

  emits: ['close'],

  setup(props) {
    const localVisible = computed(() => props.visible);

    return {
      localVisible,
    };
  },

  data() {
    return {
      customStyle: {
        width: '200%',
        height: '200%',
        top: '-50%',
        left: '-50%',
      },
    };
  },

  methods: {
    close() {
      this.$emit('close');
    },
  },
});
</script>
<style lang="scss" scoped src="./index.scss" />
