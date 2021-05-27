import { App } from 'vue';

import 'vant/lib/index.css';

import { Overlay } from 'vant';

export default function (app: App) {
  app.use(Overlay);
}
