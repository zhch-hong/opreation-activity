<template>
  <div class="main">
    <component :is="currentComponent"></component>
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent, markRaw, ref, watch } from 'vue';
import activeMenu from '../../composables/active-menu';

const map = new Map<number, string>();
map.set(11, 'chaozhiyueka');
map.set(6, 'libaoduihuan');
map.set(18, 'notify');
map.set(13, 'sanyuanlibao');
map.set(15, 'vip1zhitong');

export default defineComponent({
  setup() {
    const currentComponent = ref(markRaw(defineAsyncComponent(() => import(`./dynamic/default-component/index.vue`))));

    watch(
      () => activeMenu.value,
      (value) => {
        currentComponent.value = markRaw(
          defineAsyncComponent(() => import(`./dynamic/${map.get(value) || 'default-component'}/index.vue`))
        );
      },
      {
        immediate: true,
      }
    );

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
  border-radius: 24px;
  overflow: auto;
}
</style>
