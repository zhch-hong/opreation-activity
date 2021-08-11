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

emitter.on('webviewWillAppear', () => {
  notifyIndex = 0;
  notifyStack.splice(0);

  if (notifyApp) notifyApp.unmount();
  if (mountDiv) mountDiv.remove();
});

function mountNotify() {
  const el = notifyStack[notifyIndex];
  if (typeof el === 'undefined') {
    notifyIndex = 0;
    notifyStack.splice(0);
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
