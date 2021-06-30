import { createApp, h, nextTick } from 'vue';
import AssetNotify from './index.vue';

type Asset = {
  name: string;
  count: number;
};

const notifyStack: Asset[] = [];
let notifyIndex = 0;

function mountNotify() {
  const el = notifyStack[notifyIndex];
  if (typeof el === 'undefined') {
    notifyIndex = 0;
    notifyStack.splice(0);
    return;
  }

  const div = document.createElement('div');
  document.body.append(div);

  const app = createApp({
    render() {
      return h(AssetNotify, {
        name: el.name,
        count: el.count,
        onConfirm: async () => {
          notifyIndex++;
          app.unmount();
          div.remove();
          await nextTick();
          mountNotify();
        },
      });
    },
  });

  app.mount(div);
}

export default (assets: Asset[]): void => {
  const len = notifyStack.length;

  notifyStack.push(...assets);

  if (len === 0) {
    mountNotify();
  }
};

export { default as notifyValidate } from './asset-notify-validate';
export { addListenMsg, removeListenMsg } from './listener-message';
