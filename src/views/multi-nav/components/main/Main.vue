<template>
  <div class="main">
    <component :is="currentComponent"></component>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, ref, watchEffect } from 'vue';
import activeMenu from '../../composables/active-menu';

import Chaozhiyueka from './dynamic/chaozhiyueka/index.vue';
import Libaoduihuan from './dynamic/libaoduihuan/index.vue';
import Notify from './dynamic/notify/index.vue';
import Sanyuanlibao from './dynamic/sanyuanlibao/index.vue';
import Vip1zhitong from './dynamic/vip1zhitong/index.vue';

const map = new Map<number, string>();
map.set(11, 'Chaozhiyueka');
map.set(6, 'Libaoduihuan');
map.set(18, 'Notify');
map.set(13, 'Sanyuanlibao');
map.set(15, 'Vip1zhitong');

export default defineComponent({
  components: {
    'default-component': {
      render() {
        return h('div', ['未找到对应组件']);
      },
    },
    Chaozhiyueka,
    Notify,
    Sanyuanlibao,
    Libaoduihuan,
    Vip1zhitong,
  },

  setup() {
    const currentComponent = ref('');

    watchEffect(() => (currentComponent.value = map.get(activeMenu.value) || 'default-component'));

    return {
      currentComponent,
    };
  },
});
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  height: 760px;
  width: 1113px;
  border: 10px solid white;
  border-radius: 26px;
  overflow: auto;
}
</style>
