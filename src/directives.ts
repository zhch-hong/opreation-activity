import { App } from 'vue';

export default function (app: App) {
  app.directive('center', {
    mounted(element: HTMLElement) {
      element.classList.add('flex-center');
    },
  });
}
