<template>
  <router-view />
  <Refresh />
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { isBrowser, isWebview } from '@/runtime-env';
import { fetchMessage, login, loopFetch } from '@/network';
import parseHref from '@/utils/parse-href';
import Refresh from '@/Refresh.vue';
import store from './store';

export default defineComponent({
  components: {
    Refresh,
  },

  setup() {
    // 解析 location.href 上的token和服务器的url
    parseHref();

    // 视图缩放，当内容高度大于窗口高度时，将内容高度缩小到窗口高度
    // 当内容高度小于窗口高度时，则不进行缩放
    const appElement = document.querySelector('#app') as HTMLDivElement;
    let scale: string | null = store.state.scale;

    if (scale) {
      appElement.style.transform = scale;
    } else {
      onMounted(() => {
        setTimeout(() => {
          let s = window.innerHeight / parseFloat(getComputedStyle(appElement).getPropertyValue('height'));

          if (s > 1) s = 1;
          const v = `scale(${s})`;
          appElement.style.transform = v;

          if (isWebview) {
            fetchMessage(`unityfun://storage?1_string=scale&2_string=${v}`, false);
          } else {
            localStorage.setItem('scale', v);
          }
        }, 1000);
      });
    }

    // 登录
    login();

    // 如果在浏览器中，要循环请求主动推送到webview的消息
    if (isBrowser) {
      loopFetch();
    }
  },
});
</script>

<style lang="scss">
*::-webkit-scrollbar {
  width: 0;
  height: 0;
}

@font-face {
  font-family: 'FZY3JW';
  src: url('https://cdnjydown.jyhd919.cn/jydown/Version2020/Web/zt.ttf');
}

@font-face {
  font-family: 'FZY4JW';
  src: url('https://cdnjydown.jyhd919.cn/jydown/Version2020/Web/ct.ttf');
}

html {
  width: 100vw;
  height: 100vh;
  // padding: constant(safe-area-inset-top) constant(safe-area-inset-right) constant(safe-area-inset-bottom)
  //   constant(safe-area-inset-left); /* 兼容 iOS < 11.2 */
  // padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); /* 兼容 iOS >= 11.2 */
}

body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-size: 32px;
  font-family: 'FZY4JW' !important;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
