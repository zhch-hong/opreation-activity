import { createApp, defineAsyncComponent, h, nextTick } from 'vue';

type Asset = {
  name: string;
  count: number;
};

const notifyStack: Asset[] = [];

function mountNotify() {
  const el = notifyStack.shift();
  if (!el) return;

  const div = document.createElement('div');
  document.body.append(div);

  const app = createApp({
    render() {
      return h(
        defineAsyncComponent(() => import('./AssetNotify.vue')),
        {
          name: el.name,
          count: el.count,
          onConfirm: async () => {
            app.unmount();
            div.remove();
            await nextTick();
            mountNotify();
          },
        }
      );
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
