<template>
  <img class="tag" :src="imgSrc" :alt="tag" />
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import hot from '../../image/icon_1.png';
import limit from '../../image/icon_2.png';
import news from '../../image/icon_3.png';

export default defineComponent({
  props: {
    tag: String as PropType<'hot' | 'limit' | 'new'>,
  },

  setup(props) {
    const imgSrc = ref('');

    watch(
      () => props.tag,
      (value) => {
        if (value === 'hot') imgSrc.value = hot;
        if (value === 'limit') imgSrc.value = limit;
        if (value === 'new') imgSrc.value = news;
      },
      {
        immediate: true,
      }
    );

    return {
      imgSrc,
    };
  },
});
</script>
<style lang="scss" scoped>
img.tag {
  position: absolute;
  z-index: 1;
  top: -12px;
  left: -14px;
  width: 144px;
  height: 121px;
}
</style>
