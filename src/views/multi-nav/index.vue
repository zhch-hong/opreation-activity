<template>
  <div v-bind="$attrs" class="multi-nav">
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
