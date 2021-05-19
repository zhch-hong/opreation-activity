<template>
  <div class="price-nav" @click="activePrice = price['price|价格']">
    <div :class="[activePrice === price['price|价格'] ? 'active' : 'inactive']"></div>
    <span class="price" :style="{ color: activePrice === price['price|价格'] ? '#bb5917' : '#36508f' }"
      >{{ price['price|价格'] }}元</span
    >
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { activePrice } from '../composables/composition';

export default defineComponent({
  props: {
    price: {
      type: Object,
      default: () => ({}),
    },
  },

  setup() {
    return {
      activePrice,
    };
  },
});
</script>

<style lang="scss" scoped>
div.price-nav {
  position: relative;
  height: 100px;
  line-height: 100px;
  text-align: center;

  span.price {
    font-size: 50px;
    font-weight: 600;
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
  }
}

.active,
.inactive {
  position: absolute;
  bottom: 0;
  left: 15px;
}
.inactive {
  width: 220px;
  height: 92px;
  background-image: url('../../../assets/image/jhs_btn_1.png');
  background-size: contain;
}
.active {
  width: 234px;
  height: 102px;
  background-image: url('../../../assets/image/jhs_btn_2.png');
  background-size: contain;
}
</style>
