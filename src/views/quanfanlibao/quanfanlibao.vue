<template>
  <div v-bind="$attrs" class="quanfanlibao">
    <!-- 关闭按钮 -->
    <a class="close" href="uniwebviewfun://Hide">
      <img src="@/assets/image/close_2.png" alt="关闭" />
    </a>

    <!-- 说明 -->
    <img class="rule-panel" src="./image/qflb_btn_wh.png" alt="说明" @click="showRulePanel = true" />

    <!-- 100%全返 -->
    <img class="tip" src="./image/qflb_icon_sm.png" alt="100%全返" />

    <!-- 所得资产 -->
    <div class="all-award" v-html="activeConfig.content"></div>

    <!-- 导航菜单 -->
    <ActMenu />

    <TaskPanel v-if="bought.includes(activeID)" />
    <PayPanel v-else />
  </div>
  <RulePanel :visible="showRulePanel" @close="showRulePanel = false" />
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref } from 'vue';

import { activeObserver } from './composition';

import { SKT_NOTIFY_ASSET_CHANGE_MSG, SKT_NOTIFY_PAY_ORDER_MSG, SKT_TASK_CHANGE_MSG } from '@/api-socket';
import { API_QUERY_ALL_RETURN_LB_INFO } from '@/api';

import ActMenu from './components/ActMenu.vue';
import PayPanel from './components/PayPanel.vue';
import RulePanel from './components/RulePanel.vue';
import TaskPanel from './components/TaskPanel.vue';
import { QUANFANLIBAO } from '@/shopping';
import _ from 'lodash';

export default defineComponent({
  name: '全返礼包',

  components: {
    RulePanel,
    ActMenu,
    PayPanel,
    TaskPanel,
  },

  setup() {
    const goodsidList = QUANFANLIBAO.map((b) => b.id);
    const taskidList = QUANFANLIBAO.map((b) => b.taskid);
    const showRulePanel = ref(false);
    const { activeID, activeConfig, progress, bought, queryAll, queryCurrentTask } = activeObserver();

    onBeforeMount(queryAll);

    SKT_NOTIFY_ASSET_CHANGE_MSG();

    SKT_NOTIFY_PAY_ORDER_MSG(({ goods_id }) => {
      if (goodsidList.includes(goods_id)) {
        queryAll();
      }
    });

    SKT_TASK_CHANGE_MSG(({ task_item }) => {
      const { id } = task_item;
      if (taskidList.includes(id)) {
        const result = QUANFANLIBAO.find((b) => b.taskid === id);
        if (typeof result !== 'undefined') {
          if (activeID.value === result.id) {
            progress.value = _.toNumber(task_item.now_total_process);
            queryCurrentTask();
          }
        }
      }
    });

    return {
      activeID,
      bought,
      showRulePanel,
      activeConfig,
    };
  },
});
</script>
<style lang="scss" scoped src="./quanfanlibao.scss" />
