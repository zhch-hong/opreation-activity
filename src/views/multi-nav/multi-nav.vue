<template>
  <div v-bind="$attrs" class="multi-nav">
    <span>每日福利</span><br />
    <span>疯狂返利</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MultiNav',
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
  color: aquamarine;
}
</style>
