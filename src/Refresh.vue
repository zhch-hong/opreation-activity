<template>
  <teleport to="body">
    <div class="refresh">
      <a href="uniwebviewfun://CleanCache">清除缓存</a>
      <a href="uniwebviewfun://Reload">刷新</a>
      <a href="uniwebviewfun://Hide">关闭</a>
      <a href="unityfun://destroy">销毁</a>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Refresh',
});
</script>
<style lang="scss" scoped>
.refresh {
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 1000;

  a {
    background-color: rgba(51, 153, 255, 0.5);
    padding: 10px 30px;
    margin-right: 20px;
    border-radius: 6px;
    color: turquoise;
  }
}
</style>
