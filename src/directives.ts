import { App } from 'vue';

export default function (app: App) {
  app.directive('flex', {
    created: function (el: HTMLElement, binding) {
      console.log(el, binding);
    },
  });
}
