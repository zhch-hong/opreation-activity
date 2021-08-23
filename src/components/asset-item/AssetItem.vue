<template>
  <div class="asset-item">
    <div class="asset">
      <div class="icon">
        <Image fit="contain" height="95%" :src="iconSrc"></Image>
      </div>
      <div class="count">
        <slot></slot>
      </div>
    </div>
    <div v-if="subText" class="name">
      <span>{{ subText }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { getAssetContent } from '../asset-notify';
import { Image } from 'vant';
import 'vant/es/image/style';

export default defineComponent({
  components: {
    Image,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const subText = ref('');
    const iconSrc = ref('');

    watch(
      () => props.name,
      (value) => {
        const { name, icon } = getAssetContent(value);
        subText.value = name as string;
        iconSrc.value = icon as string;
      },
      {
        immediate: true,
      }
    );

    return { subText, iconSrc };
  },
});
</script>

<style lang="scss" scoped>
.asset-item {
  display: inline-block;
  width: 178px;
  color: #fff;
  white-space: nowrap;

  .asset {
    .icon {
      box-sizing: border-box;
      height: 128px;
      border-top: 5px solid #fff;
      border-right: 5px solid #fff;
      border-left: 5px solid #fff;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      background-color: #a2d6e9;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .count {
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-color: #65b3e1;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }

  .name {
    display: flex;
    justify-content: center;
    margin: 30px 0 0 0;
  }
}
.asset-item + .asset-item {
  margin-left: 60px;
}
</style>
