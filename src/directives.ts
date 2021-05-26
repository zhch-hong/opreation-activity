import { App } from 'vue';

export default function (app: App) {
  app.directive('center', {
    beforeMount: function (el: HTMLElement) {
      el.classList.add('center');
    },
  });
}
