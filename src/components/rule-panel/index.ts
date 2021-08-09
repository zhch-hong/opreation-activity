import { createApp } from 'vue';
import RulePanel from './RulePanel.vue';

export default (ruleList: string[]) => {
  const div = document.createElement('div');
  document.body.append(div);

  const app = createApp(RulePanel, {
    ruleList,
    onUnmount: () => {
      app.unmount();
      div.remove();
    },
  });

  app.mount(div);
};
