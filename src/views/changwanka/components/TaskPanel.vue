<template>
  <div class="task-panel">
    <!-- 关闭按钮 -->
    <a class="close" href="uniwebviewfun://Hide">
      <img src="@/assets/image/close_2.png" alt="关闭" />
    </a>

    <!-- 规则说明 -->
    <img class="ques" src="../image/com_btn_rule2.png" alt="规则说明" @click="ruleHandler" />

    <main class="main">
      <p class="cutdown">剩余时间：{{ overTime }}</p>
      <TaskRow :data="taskTop" @award-done="fetchTaskTop" />
      <TaskRow :data="taskMid" @award-done="fetchTaskMid" @refresh="refreshHandler(1)" />
      <TaskRow :data="taskBot" @award-done="fetchTaskBot" @refresh="refreshHandler(2)" />
    </main>
  </div>
</template>
<script lang="ts">
import { SKT_QUERY_CHANG_WAN_KA_BASE_INFO, SKT_TASK_CHANGE_MSG } from '@/vendors/api-socket';
import rulePanel from '@/components/rule-panel';
import _ from 'lodash';
import { defineComponent } from 'vue';
import composition from '../composition';

import TaskRow from './TaskRow.vue';

export default defineComponent({
  components: {
    TaskRow,
  },

  setup() {
    const { taskTop, taskMid, taskBot, overTime, refreshHandler, fetchTaskTop, fetchTaskMid, fetchTaskBot } =
      composition();

    // SKT_QUERY_CHANG_WAN_KA_BASE_INFO((response) => {
    //
    // });

    SKT_TASK_CHANGE_MSG(({ task_item }) => {
      if (task_item) {
        const { id } = task_item;

        if (id === taskMid.taskid) {
          const { award_status, now_total_process } = task_item;
          taskMid.progress = _.toNumber(now_total_process);
          taskMid.status = award_status;
        }

        if (id === taskBot.taskid) {
          const { award_status, now_total_process } = task_item;
          taskBot.progress = _.toNumber(now_total_process);
          taskBot.status = award_status;
        }
      }
    });

    return {
      taskTop,
      taskMid,
      taskBot,
      overTime,
      refreshHandler,
      fetchTaskTop,
      fetchTaskMid,
      fetchTaskBot,
    };
  },

  methods: {
    ruleHandler() {
      const ruleList = [
        '畅享卡购买后立得500万金币，剩余20天每日登录可领40万金币',
        '每日完成后2个任务共领400福利券，每个任务每日限领一次，共领20次',
        '任务刷新首次免费，之后每次需30000金币，次数不限',
        '当日未完成的任务次日清零，刷新重置',
        '任务需在购买30日内完成，时间截止后任务失效',
      ];

      rulePanel(ruleList);
    },
  },
});
</script>

<style lang="scss" scoped>
.task-panel {
  position: relative;
  width: 1920px;
  height: 1080px;
  background: url('../image/back2.png') center/contain no-repeat;
}
a.close {
  position: absolute;
  right: 160px;
  top: 60px;

  img {
    width: 96px;
    height: 100px;
  }
}

img.ques {
  position: absolute;
  width: 58px;
  height: 58px;
  top: 200px;
  right: 320px;
}

.main {
  position: relative;
  top: 260px;
  width: 1287px;
  margin: 0 auto;

  .cutdown {
    text-align: center;
    color: #4d4eb0;
  }
}
</style>
