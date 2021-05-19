<template>
  <div ref="Home" v-bind="$attrs" class="home">
    <!-- 关闭按钮 -->
    <button class="close" @click="closeWebview"></button>
    <!-- 主体内容 -->
    <div class="container">
      <!-- 礼包价格档次 -->
      <ul ref="PriceList" class="price-list">
        <li v-for="(price, index) of priceList" :key="index" class="price-item">
          <PriceNav :price="price" />
        </li>
      </ul>
      <!-- 礼包内容 -->
      <PriceContent v-if="userid" />
    </div>
  </div>
  <Modal />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import webview2client, { installMessage, listenerPositiveMessage, uninstallMessage } from '@/network';
import listener, { priceList } from './composables/composition';
import { notify } from './composables/notify';

import PriceNav from './components/PriceNav.vue';
import PriceContent from './components/PriceContent.vue';
import Modal from './components/Modal.vue';
import store from '@/store';

export default defineComponent({
  components: {
    Modal,
    PriceNav,
    PriceContent,
  },

  setup() {
    return {
      priceList,
    };
  },

  created() {
    // 注册需要监听的服务端消息
    installMessage({
      user_id: store.state.user.user_id,
      msg_names: ['notify_asset_change_msg'],
    });

    // 监听推送的消息，做相应的处理
    listenerPositiveMessage('notify_asset_change_msg', (data) => {
      notify([{ name: 'notify_asset_change_msg', data }]);
    });

    // composition 数据变化监听
    listener();
  },

  methods: {
    closeWebview() {
      webview2client()('uniwebviewfun://Hide', false);
      uninstallMessage({
        user_id: store.state.user.user_id,
        msg_names: ['notify_asset_change_msg'],
      });
    },
  },
});
</script>

<style lang="scss" scoped>
div.home {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-image: url('../../assets/image/background_main.png');
  background-repeat: no-repeat;
  background-size: contain;

  button.close {
    position: absolute;
    right: 120px;
    top: 40px;
    width: 96px;
    height: 100px;
    outline: none;
    border: none;
    background: url('../../assets/image/ty_btn_qx.png') no-repeat center/contain;
  }

  div.container {
    position: absolute;
    left: 243px;
    top: 260px;
    width: 1437px;
    display: flex;
    justify-content: space-evenly;
  }

  .price-list {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    list-style: none;
    width: 250px;
    height: 710px;
    overflow: auto;
    background: linear-gradient(to bottom, #b17eac, #efbedf);
    text-align: center;
    border-radius: 30px;

    .price-item {
      margin: 20px 0;
    }
  }
}
</style>
