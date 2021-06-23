<template>
  <div class="vip">
    <img class="pay" src="./image/buy.png" alt="10元领取" @click="submit" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import payPanel from '@/components/pay-panel';

export default defineComponent({
  name: 'Vip1zhitong',

  methods: {
    submit() {
      payPanel(10337, 10);
    },
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
