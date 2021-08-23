<template>
  <Overlay :show="inheritedShow" :duration="0.1" :custom-style="{ width: '200vw', left: '-50vw' }">
    <!-- 太阳光旋转动画背景 -->
    <div class="animate"></div>
    <!-- 主体内容 -->
    <div class="main">
      <!-- 恭喜获得 -->
      <div class="title"></div>
      <!-- 资产 -->
      <div class="asset">
        <AssetItem v-for="(notify, index) of inheritedList" :key="index" :name="notify.name">
          <span>{{ tranNumber(notify.count) }}</span>
        </AssetItem>
      </div>
      <!-- 确定 -->
      <div class="confirm" @click="$emit('confirm')"></div>
    </div>
  </Overlay>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, Ref } from 'vue';
import AssetItem from '@/components/asset-item/AssetItem.vue';
import { tranNumber } from '@/utils/transform-unit';
import { Asset } from '.';
import { Overlay } from 'vant';
import 'vant/es/overlay/style';

export default defineComponent({
  name: 'AssetNotify',

  components: { Overlay, AssetItem },

  props: {
    show: {
      type: Object as PropType<Ref<boolean>>,
      required: true,
    },
    notifyList: {
      type: Object as PropType<Ref<Asset[]>>,
      required: true,
    },
  },

  emits: ['confirm'],

  setup(props) {
    const inheritedShow = computed(() => props.show.value);
    const inheritedList = computed(() => props.notifyList.value);

    return {
      inheritedShow,
      inheritedList,
      tranNumber,
    };
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
