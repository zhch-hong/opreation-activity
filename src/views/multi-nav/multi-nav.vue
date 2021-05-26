<template>
  <div v-flex:xx="'xxx'" ref="MultiNav" class="multi-nav">
    <div class="scroll-wrap-ignore">
      <p v-for="index in 100" :key="index" :class="[index % 2 === 0 ? 'a' : 'b']">
        <span>______p_{{ index }}</span>
      </p>
    </div>
  </div>
  <teleport to="body">
    <OverLay v-model:visible="visible" :lock-scroll="true">
      <div style="background-color: yellow">xxx</div>
    </OverLay>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { OverLay } from '@nutui/nutui';
import BScroll from '@better-scroll/core';

export default defineComponent({
  components: {
    OverLay,
  },

  setup() {
    const visible = ref(true);

    return {
      visible,
    };
  },

  data() {
    return {
      value: '',
    };
  },

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        new BScroll(this.$refs.MultiNav as HTMLDivElement, {
          bounce: true,
        });
      }, 600);
    });
  },
});
</script>
<style lang="scss" scoped>
.multi-nav {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-image: url('../../assets/Snipaste_2021-05-25_10-03-38.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;

  .scroll-wrap-ignore {
    font-size: 16px;

    p {
      margin: 0;
      padding: 10px;
      height: 20px;
      line-height: 20px;
    }
  }
}

.a {
  background-color: rgba(188, 143, 143, 0.5);
}

.b {
  background-color: rgba(244, 164, 96, 0.5);
}
</style>
