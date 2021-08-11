<template>
  <div v-if="isBuyed" class="redirect">
    <div class="button" @click="redirect"></div>
  </div>
  <div v-else v-bind="$attrs" class="container" @click="submit"></div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { SANYUANLIBAO } from '@/vendors/shopping';
import { API_QUERY_GIFT_BAG_STATUS } from '@/vendors/api';
import payPanel from '@/components/pay-panel';
import { activeMenu } from '@/views/multi-nav/composables/current-menuitem';
import { SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/vendors/api-socket';

export default defineComponent({
  setup() {
    const isBuyed = ref(false);

    SKT_NOTIFY_ASSET_CHANGE_MSG();

    API_QUERY_GIFT_BAG_STATUS(SANYUANLIBAO.id).then(({ status }) => {
      isBuyed.value = status === 0;
    });

    return {
      isBuyed,
    };
  },

  methods: {
    submit() {
      payPanel(SANYUANLIBAO.id, SANYUANLIBAO.price);
    },

    redirect() {
      const { menuID } = activeMenu();
      menuID.value = 7;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background: url('./image/back.png') center/cover no-repeat;
}

.redirect {
  height: 100%;
  background: url('./image/3yfllb_bg_1.png') center/cover no-repeat;

  div.button {
    position: absolute;
    width: 266px;
    height: 100px;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: url('../../../../../../assets/image/jk_btn_ljlq3.png') center/cover no-repeat;
  }
}
</style>
