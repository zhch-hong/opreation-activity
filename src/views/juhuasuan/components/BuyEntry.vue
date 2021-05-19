<template>
  <div class="buy-entry">
    <!-- 标题 -->
    <span class="title">{{ title }}</span>

    <!-- 金币 -->
    <span class="gold">{{ count }}金币</span>

    <!-- 金币图标 -->
    <img class="gold" :src="image" alt="金币" />

    <!-- 已购买 -->
    <img v-if="!enable" class="buyed" src="@/assets/image/jhs_imgf_ygm.png" alt="金币" />

    <!-- 加赠金币 -->
    <div class="gold-add">
      <img src="@/assets/image/jhs_imgf_jz.png" alt="加赠" />
      <span>{{ addCount }}金币</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BuyEntry',

  props: ['enable', 'title', 'count', 'image', 'addCount'],
});
</script>

<style lang="scss" scoped>
.buy-entry {
  position: relative;
  width: 346px;
  height: 100%;
  background-image: url('../../../assets/image/jhs_bg_2.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  & > span {
    color: white;
    font-weight: bold;
    position: absolute;
    transform: translateX(-50%);
    margin-left: 50%;
    font-size: 34px;
    white-space: nowrap;
  }

  /** 标题  */
  & > span.title {
    top: 22px;
  }

  /** 金币 */
  & > span.gold {
    top: 94px;
  }

  /** 金币icon */
  & > img.gold {
    position: absolute;
    width: 200px;
    height: 200px;
    top: 130px;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  & > img.buyed {
    position: absolute;
    margin-left: 50%;
    width: 126px;
    height: 126px;
    transform: translateX(-50%);
    top: 150px;
  }

  /** 加赠金币 */
  & > div.gold-add {
    // background-color: rgba(51, 204, 51, 0.4);
    position: absolute;
    font-size: 34px;
    white-space: nowrap;
    top: 348px;
    left: 0;
    width: 100%;
    height: 80px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    color: white;
    font-weight: bold;
    & > img {
      width: 96px;
      height: 48px;
    }
  }
}
</style>
