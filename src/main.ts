import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store';

import { installListener } from '@/window-listener';

// 在webview中要添加全局方法供uniwebview调用，这些仅在客户端环境被使用
installListener();

createApp(App).use(store, key).use(router).mount('#app');
