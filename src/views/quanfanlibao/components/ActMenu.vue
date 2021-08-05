<template>
  <ul class="menu-ul">
    <li
      v-for="gift of giftList"
      :key="gift.id"
      :class="[activeID === gift.id ? 'active' : 'inactive']"
      @click="activeID = gift.id"
    >
      <span>{{ gift.name }}</span>
    </li>
  </ul>
</template>
<script lang="ts">
import { QUANFANLIBAO } from '@/shopping';
import { defineComponent } from 'vue';
import { activeObserver } from '../composition';

export default defineComponent({
  name: '礼包菜单',

  setup() {
    const { activeID } = activeObserver();

    return {
      activeID,
      giftList: QUANFANLIBAO,
    };
  },
});
</script>
<style lang="scss" scoped>
.menu-ul {
  position: absolute;
  top: 320px;
  left: 140px;

  li {
    position: relative;
    width: 204px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    font-size: 46px;
    color: #255293;
    letter-spacing: 16px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: left top;
    margin-bottom: 40px;
    text-shadow: 0 1px #fff, 1px 0 #fff, -1px 0 #fff, 0 -1px #fff;
    -webkit-text-stroke: 0.3px #fff;
  }

  li:last-child {
    margin-bottom: 0;
  }
}

.active {
  background-image: url('../image/active.png');
}

.inactive {
  background-image: url('../image/inactive.png');
}
</style>
