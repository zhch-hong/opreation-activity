<template>
  <div class="main">
    <component :is="currentComponent"></component>
  </div>
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent, markRaw, ref, watch } from 'vue';
import { activeMenu } from '../../composables/active-menu';

export default defineComponent({
  setup() {
    const { menuComponentName } = activeMenu();
    const currentComponent = ref(markRaw(defineAsyncComponent(() => import(`./dynamic/default-component/index.vue`))));

    watch(
      menuComponentName,
      (value) => {
        currentComponent.value = markRaw(defineAsyncComponent(() => import(`./dynamic/${value}/index.vue`)));
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
