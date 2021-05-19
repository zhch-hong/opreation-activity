<template>
  <div class="price-content">
    <div class="back">
      <div class="entry-warp">
        <BuyEntry v-if="firstData" v-bind="firstData" title="当日首次购买" :enable="firstEnable" />
        <BuyEntry v-if="againData" v-bind="againData" title="当日再次购买" :enable="twoceEnable" />
      </div>
      <LimitTime v-if="tenMin" v-bind="tenMin" :enable="tenEnable" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { activePricedata, firstEnable, twoceEnable, tenEnable } from '../composables/composition';
import BuyEntry from './BuyEntry.vue';
import LimitTime from './LimitTime.vue';

// 金币icon
import ty_icon_jb_2498y from '@/assets/image/ty_icon_jb_2498y.png';
import ty_icon_jb_998y from '@/assets/image/ty_icon_jb_998y.png';
import ty_icon_jb_498y from '@/assets/image/ty_icon_jb_498y.png';
import ty_icon_jb_198y from '@/assets/image/ty_icon_jb_198y.png';
import ty_icon_jb_98y from '@/assets/image/ty_icon_jb_98y.png';
import ty_icon_jb_30y from '@/assets/image/ty_icon_jb_30y.png';
import ty_icon_jb_18y from '@/assets/image/ty_icon_jb_18y.png';

const ICON: Record<string, string> = {
  ty_icon_jb_18y,
  ty_icon_jb_30y,
  ty_icon_jb_98y,
  ty_icon_jb_198y,
  ty_icon_jb_498y,
  ty_icon_jb_998y,
  ty_icon_jb_2498y,
};

export default defineComponent({
  name: 'PriceContent',

  components: {
    BuyEntry,
    LimitTime,
  },

  setup() {
    const firstData = ref<Record<string, unknown> | null>(null);
    const againData = ref<Record<string, unknown> | null>(null);
    const tenMin = ref<Record<string, unknown> | null>(null);

    watch(
      activePricedata,
      (params) => {
        if (!params) return;

        const images = (params['image|图片'] as string).split(',');
        const shopId = (params['shop_id|商品ID'] as string).split(',');

        const firstBuy = (params['first_buy|首次'] as string).split(',');
        const first = {
          id: shopId[0],
          count: firstBuy[0].slice(1, -1),
          addCount: firstBuy[1].slice(1, -1),
          image: ICON[images[0].slice(1, -1)],
        };

        const twoceBuy = (params['twoce_buy|再购'] as string).split(',');
        const twoce = {
          id: shopId[1],
          count: twoceBuy[0].slice(1, -1),
          addCount: twoceBuy[1].slice(1, -1),
          image: ICON[images[1].slice(1, -1)],
        };

        const ten = {
          id: shopId[2],
          count: (params['ten_min|10分钟加赠'] as string).slice(1, -2),
        };

        firstData.value = first;
        againData.value = twoce;
        tenMin.value = ten;
      },
      { deep: true, immediate: true }
    );

    return {
      firstData,
      againData,
      tenMin,
      firstEnable,
      twoceEnable,
      tenEnable,
    };
  },
});
</script>
<style lang="scss" scoped>
div.price-content {
  width: 1100px;
  display: flex;
  align-items: center;
  justify-content: center;

  div.back {
    width: 1101px;
    height: 715px;
    background: url('../../../assets/image/jhs_bg_3.png') no-repeat;
    background-size: contain;
  }

  div.entry-warp {
    height: 440px;
    display: flex;
    justify-content: space-evenly;
    margin: 20px 0;
  }
}
</style>
