<template>
  <div class="refresh">
    <a href="uniwebviewfun://CleanCache">清除缓存</a>
    <a href="uniwebviewfun://Reload">刷新</a>
    <a href="uniwebviewfun://Hide">关闭</a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>
<style lang="scss" scoped>
.refresh {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 10;

  a {
    background-color: rgba(51, 153, 255, 0.5);
    padding: 20px 30px;
    margin: 20px;
    font-size: 40px;
  }
}
</style>
