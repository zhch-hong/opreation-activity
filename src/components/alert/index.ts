import { createApp, defineAsyncComponent, h } from 'vue';

export default function (message: string) {
  const div = document.createElement('div');
  const el = document.getElementById('app');

  const vnode = h(
    defineAsyncComponent(() => import('./index.vue')),

    {
      visible: true,
      showClose: false,
      message,
      onClose: () => {
        app.unmount();
        div.remove();
      },
    }
  );

  const app = createApp(vnode);

  if (el) {
    el.append(div);
    app.mount(div);
  } else {
    app.unmount();
  }
}
