<template>
  <div v-bind="$attrs" class="multi-nav">
    <!-- 关闭按钮 -->
    <a class="close" href="uniwebviewfun://Hide">
      <img src="@/assets/image/close_1.png" alt="关闭" />
    </a>

    <div class="container">
      <Menu />
      <Main />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Menu from './components/menu/Menu.vue';
import Main from './components/main/Main.vue';

export default defineComponent({
  name: 'MultiNav',

  components: {
    Menu,
    Main,
  },
});
</script>
<style lang="scss" scoped>
.multi-nav {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-image: url('./image/bg_1.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
  color: aquamarine;

  & > a.close {
    position: absolute;
    right: 140px;
    top: 50px;

    img {
      width: 104px;
      height: 104px;
    }
  }
}

.container {
  position: relative;
  box-sizing: border-box;
  margin: 186px 178px auto 178px;
  padding: 43px 35px 37px 35px;
  display: flex;
  justify-content: space-between;
}
</style>
