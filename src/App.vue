<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { isBrowser } from '@/runtime-env';
import { login, loopFetch } from '@/network';
import parseHref from '@/utils/parse-href';

export default defineComponent({
  setup() {
    // 视图缩放，当内容高度大于窗口高度时，将内容高度缩小到窗口高度
    // 当内容高度小于窗口高度时，则不进行缩放
    const html = document.querySelector('html');
    if (html) {
      const appScale = localStorage.getItem('appScale');
      if (appScale) {
        html.style.transform = appScale;
      } else {
        onMounted(() => {
          setTimeout(() => {
            const h = parseFloat(getComputedStyle(html).getPropertyValue('height'));
            let s = window.innerHeight / h;
            if (s > 1) s = 1;
            const v = `scale(${s})`;
            html.style.transform = v;
            localStorage.setItem('appScale', v);
          }, 300);
        });
      }
    }

    // 解析 location.href 上的token和服务器的url
    parseHref();

    // 登录
    login();

    // 如果在浏览器中，要循环请求主动推送到webview的消息
    if (isBrowser) {
      loopFetch();
    }
  },
});
</script>

<style>
*::-webkit-scrollbar {
  width: 0;
  height: 0;
}

body {
  margin: 0;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
