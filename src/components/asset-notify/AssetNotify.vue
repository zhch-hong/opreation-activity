<template>
  <teleport to="#app">
    <Overlay :show="true" :custom-style="{ width: '200vw', left: '-50vw' }">
      <!-- 太阳光旋转动画背景 -->
      <div class="animate"></div>
      <!-- 主体内容 -->
      <div class="main">
        <!-- 恭喜获得 -->
        <div class="title"></div>
        <!-- 资产 -->
        <div class="asset">
          <div class="content">
            <!-- 图片 -->
            <div class="icon-warp">
              <img class="icon" :src="assetIcon" alt="资产" @error="iconError" />
            </div>
            <!-- 数量 -->
            <span class="count">x{{ tranNumber(assetCount) }}</span>
          </div>
          <!-- 名称 -->
          <span class="text">{{ assetName }}</span>
        </div>
        <!-- 确定 -->
        <div class="confirm" @click="$emit('confirm')"></div>
      </div>
    </Overlay>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import { Overlay } from 'vant';
import 'vant/es/overlay/style';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ITEM_CONFIG: Record<string, unknown>[] = require('@/assets/json/item_config.json')['config'];

export default defineComponent({
  name: 'Modal',

  components: { Overlay },

  props: {
    name: String,
    count: Number,
  },

  emits: ['confirm'],

  setup(props) {
    const assetName = ref('');
    const assetCount = ref(0);
    const assetIcon = ref('');

    const item = ITEM_CONFIG.find((row) => row['item_key'] === props.name);
    if (item) {
      assetName.value = item['name'] as string;
      assetCount.value = props.count || 0;
      assetIcon.value = `${process.env.VUE_APP_ASSET_URL}/game_activity/item_config_image/${item['image']}.png`;
    } else {
      assetName.value = props.name || '';
      assetCount.value = props.count || 0;
      assetIcon.value = '';
    }

    return {
      assetName,
      assetCount,
      assetIcon,
    };
  },

  methods: {
    /**
     * 数字转整数 如 100000 转为10万
     * @param {需要转化的数} num
     * @param {需要保留的小数位数} point
     */
    tranNumber(num: number, point?: number) {
      let numStr = num.toString();
      if (numStr.length < 5) {
        return numStr;
      } else if (numStr.length < 9) {
        if (num % 10000 === 0) return num / 10000 + '万';
        return (num / 10000).toFixed(point || 2) + '万';
      } else {
        if (num % 100000000 === 0) return num / 10000 + '亿';
        return (num / 100000000).toFixed(point || 2) + '亿';
      }
    },

    iconError() {
      this.assetIcon = `${process.env.VUE_APP_ASSET_URL}/game_activity/item_config_image/hqyd_imgf_8.png`;
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
