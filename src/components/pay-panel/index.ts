import { createApp, defineAsyncComponent } from 'vue';

export default (giftid: number, price: number) => {
  const div = document.createElement('div');
  document.body.append(div);

  const cpt = defineAsyncComponent(() => import('./index.vue'));
  const app = createApp(cpt, {
    giftid,
    price,
    onUnmount: () => {
      app.unmount();
      div.remove();
    },
  });

  app.mount(div);
};
