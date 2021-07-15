<template>
  <teleport to="#app">
    <Overlay :show="visible" :custom-style="customStyle" duration="0">
      <div class="wrapper">
        <img v-if="showClose" class="close" src="@/assets/image/close_1.png" alt="关闭" @click="close" />
        <div class="header">
          <slot name="title" />
        </div>
        <div class="content">
          <slot />
        </div>
      </div>
    </Overlay>
  </teleport>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

import { Overlay } from 'vant';
import 'vant/es/overlay/style';

export default defineComponent({
  name: 'OverlayDialog',

  components: { Overlay },

  props: {
    visible: Boolean,
    showClose: {
      type: Boolean,
      default: true,
    },
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
        width: '200vw',
        left: '-50vw',
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
