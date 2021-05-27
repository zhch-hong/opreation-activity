<template>
  <div v-bind="$attrs" class="multi-nav"><span @click="send">每日福利</span><br /></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { fetchMessage } from '@/network';

export default defineComponent({
  name: 'MultiNav',

  methods: {
    send() {
      fetchMessage('webmessage://addlisten?1=notify_asset_change_msg', false);
      fetchMessage('webmessage://addlisten?2=notify_asset_change_msg2', false);
    },
  },
});
</script>
<style lang="scss" scoped>
.multi-nav {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-image: url('../../assets/Snipaste_2021-05-25_10-03-38.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
  color: aquamarine;
}
</style>
