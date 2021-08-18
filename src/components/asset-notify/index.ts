import { App, createApp, h, nextTick } from 'vue';
import { emitter } from '@/vendors/window-listener';

import AssetNotify from './index.vue';

type Asset = {
  name: string;
  count: number;
};

const notifyStack: Asset[] = [];
let notifyIndex = 0;
let mountDiv: HTMLDivElement, notifyApp: App;

/**
 * 资产通知消息会发送到每一个webview，所以当webview显示时需要清除通知，以免在A活动中的资产通知，出现在了B活动中
 */
emitter.on('webviewWillAppear', () => {
  notifyIndex = 0;
  notifyStack.splice(0, notifyStack.length);

  if (notifyApp) notifyApp.unmount();
  if (mountDiv) mountDiv.remove();
});

function mountNotify() {
  const el = notifyStack[notifyIndex];
  if (typeof el === 'undefined') {
    notifyIndex = 0;
    notifyStack.splice(0, notifyStack.length);
    return;
  }

  mountDiv = document.createElement('div');
  document.body.append(mountDiv);

  notifyApp = createApp({
    render() {
      return h(AssetNotify, {
        name: el.name,
        count: el.count,
        onConfirm: async () => {
          notifyIndex++;
          notifyApp.unmount();
          mountDiv.remove();
          await nextTick();
          mountNotify();
        },
      });
    },
  });

  notifyApp.mount(mountDiv);
}

export default (assets: Asset[]): void => {
  const len = notifyStack.length;

  notifyStack.push(...assets);

  if (len === 0) {
    mountNotify();
  }
};

export { default as notifyValidate } from './asset-notify-validate';
