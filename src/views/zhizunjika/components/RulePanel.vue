<template>
  <div v-bind="$attrs" class="rule" @click="visible = true">规则</div>
  <OverlayDialog :visible="visible" @close="visible = false">
    <template #title>
      <span>规则</span>
    </template>
    <div class="rule-text">
      <p>1.季卡礼包最高可获得<b>9亿</b>金币价值奖励；</p>
      <p>2.季卡礼包购买后立即获得880万金币和90张抽奖券；</p>
      <p>3.抽奖券每天可使用1张，若当天未使用也会扣除一张，请及时使用；</p>
      <p>4.若抽完90张抽奖券获得道具的金币价值加上880万金币之和小于1980万，则联系客服可再领取1980万金币。</p>
    </div>
  </OverlayDialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import OverlayDialog from '@/components/overlay-dialog/index.vue';

export default defineComponent({
  components: {
    OverlayDialog,
  },

  setup() {
    const visible = ref(false);

    return {
      visible,
    };
  },
});
</script>
<style lang="scss" scoped>
.rule {
  position: absolute;
  left: 840px;
  top: 240px;
  color: #97a5df;
  text-decoration-line: underline;
  cursor: pointer;
}

.rule-text {
  padding: 2px 4px;
  color: #ba820c;

  p {
    margin: 0.5em;
  }

  b {
    color: #bd1c1c;
  }
}
</style>
