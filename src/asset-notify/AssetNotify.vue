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
    tranNumber(num: number, point: number) {
      let numStr = num.toString();
      // 十万以内直接返回
      if (numStr.length < 6) {
        return numStr;
      }
      //大于8位数是亿
      else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
        return parseFloat(parseInt((num / 100000000).toString()) + '.' + decimal) + '亿';
      }
      //大于6位数是十万 (以10W分割 10W以下全部显示)
      else if (numStr.length > 5) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point);
        return parseFloat(parseInt((num / 10000).toString()) + '.' + decimal) + '万';
      }
    },

    iconError() {
      this.assetIcon = `${process.env.VUE_APP_ASSET_URL}/game_activity/item_config_image/hqyd_imgf_8.png`;
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
