<template>
  <div class="vip">
    <img class="pay" src="./image/buy.png" alt="10元领取" @click="submit" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import payPanel from '@/components/pay-panel';
import { addListenMsg, removeListenMsg } from '@/components/asset-notify';
import { updateMenu } from '@/views/multi-nav/composables/nav-menu';

export default defineComponent({
  name: 'Vip1zhitong',

  methods: {
    submit() {
      payPanel(10337, 10);
    },
  },

  mounted() {
    const cb = (params: Record<string, unknown>) => {
      const type = params.type as string;
      if (type.startsWith('buy_gift_bag')) {
        updateMenu();
      }
    };
    addListenMsg(cb);
  },

  beforeUnmount() {
    removeListenMsg();
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
