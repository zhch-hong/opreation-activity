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
  top: 200px;
  right: 200px;
  z-index: 10;
  background-color: rgba(51, 153, 255, 0.5);

  a {
    padding: 20px 40px;
    margin: 20px;
    font-size: 40px;
  }
}
</style>
