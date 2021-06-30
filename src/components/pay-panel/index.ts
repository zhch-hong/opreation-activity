import { createApp } from 'vue';
import PayPanel from './index.vue';

export default (giftid: number, price: number) => {
  const div = document.createElement('div');
  document.body.append(div);

  const app = createApp(PayPanel, {
    giftid,
    price,
    onUnmount: () => {
      app.unmount();
      div.remove();
    },
  });

  app.mount(div);
};
