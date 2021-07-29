<template>
  <div class="vip">
    <img class="pay" src="./image/buy.png" alt="10元领取" @click="submit" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import payPanel from '@/components/pay-panel';
import { updateMenu } from '@/views/multi-nav/composables/nav-menu';
import { SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/api-socket';

export default defineComponent({
  name: 'Vip1zhitong',

  setup() {
    const cb = (params: Record<string, unknown>) => {
      const type = params.type as string;
      if (type.startsWith('buy_gift_bag')) {
        updateMenu();
      }
    };

    SKT_NOTIFY_ASSET_CHANGE_MSG(cb);
  },

  methods: {
    submit() {
      payPanel(10256, 780);
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
