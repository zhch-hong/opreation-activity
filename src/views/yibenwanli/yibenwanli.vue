<template>
  <div class="container">
    <!-- 关闭按钮 -->
    <a class="close" href="uniwebviewfun://Hide">
      <img src="@/assets/image/close_3.png" alt="关闭" />
    </a>

    <main class="main">
      <!-- 导航菜单 -->
      <nav>
        <div class="back-color"></div>
        <div ref="BetterScroll" class="scroll">
          <ul>
            <li
              v-for="item of dataList"
              :key="item['id']"
              :class="activeID === item['id'] ? 'active' : 'inactive'"
              @click="activeID = item['id']"
            >
              <span class="name">{{ item['name'] }}</span>
              <img v-if="bought.includes(item['id'])" class="bought" src="./image/yigou_tag.png" alt="已购买" />
              <span v-if="noreceive.includes(item['taskid'])" class="red-point"></span>
            </li>
          </ul>
        </div>
      </nav>

      <!-- 礼包主体 -->
      <section>
        <div class="content">
          <!-- 时间区域 -->
          <header>
            <img class="tip" src="@/assets/image/tip.png" alt="说明" @click="visibleRuleTip = true" />
            <div
              v-if="bought.includes(activeConfig['id']) && activeConfig['id'] !== 10390 && activeConfig['id'] !== 10391"
              class="time"
            >
              <span>本期剩余时间：{{ cutdown }}</span>
            </div>
          </header>
          <!-- 礼包状态 -->
          <div class="pay-row">
            <span class="text">购买礼包立送</span>
            <img class="icon" src="@/assets/image/jingbi.png" alt="金币" />
            <div class="count" style="background-image: url('../../assets/image/btn_back_enable.png')">
              {{ activeConfig['handsel'] }}
            </div>
            <div :class="['button', bought.includes(activeConfig['id']) ? 'disable' : 'enable']" @click="payHandler">
              <span>
                {{ bought.includes(activeConfig['id']) ? '已领取' : '领取' }}
              </span>
            </div>
          </div>
          <!-- 任务区域 -->
          <div ref="TaskScroll" class="task-scroll">
            <div>
              <TaskItem
                v-for="(item, index) of activeConfig.neednum"
                :key="index"
                :award="activeConfig.awards[index]"
                :total="activeConfig.neednum[index]"
                :get-award="activeAwards[index]"
                :consumed="consumed"
                @fetch-award="fetchAward(++index)"
                @go-task="goTask"
              />
            </div>
          </div>
        </div>

        <!-- 价格 -->
        <div class="price" @click="payHandler">
          {{ bought.includes(activeConfig['id']) ? '本期已购' : activeConfig['price'] + '元' }}
        </div>
      </section>
    </main>
  </div>
  <RuleTip :visible="visibleRuleTip" @close="visibleRuleTip = false" />
</template>
<script lang="ts">
import _ from 'lodash';
import { defineComponent, ref, watch } from 'vue';
import BScroll from '@better-scroll/core';
import { YIBENWANLI } from '@/vendors/shopping';
import { fullFetch, activeObserve } from '.';
import payPanel from '@/components/pay-panel';
import alertMsg from '@/components/alert';
import { SKT_NOTIFY_PAY_ORDER_MSG, SKT_TASK_CHANGE_MSG, SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/vendors/api-socket';

import RuleTip from './components/RuleTip.vue';
import TaskItem from './components/TaskItem.vue';
import { API_GET_TASK_AWARD_NEW } from '@/vendors/api';

export default defineComponent({
  components: {
    RuleTip,
    TaskItem,
  },

  setup() {
    const taskidList = YIBENWANLI.map((item) => item.taskid);
    const { bought, noreceive, getFullStatus, getNoreceive, cutdown } = fullFetch();
    const { activeID, activeConfig, activeStatus, activeAwards, fetchActiveAwards } = activeObserve();
    const consumed = ref(0);

    watch(
      activeStatus,
      (object) => {
        if (object) {
          consumed.value = _.toNumber(object.now_total_process);
        } else {
          consumed.value = 0;
        }
      },
      { immediate: true, deep: true }
    );

    SKT_NOTIFY_ASSET_CHANGE_MSG();

    SKT_TASK_CHANGE_MSG(({ task_item }) => {
      const { id } = task_item;
      if (taskidList.includes(id)) {
        const { award_status } = task_item;
        if (award_status === 1) {
          const index = noreceive.value.findIndex((s) => s === id);
          if (index === -1) noreceive.value.push(id);
        } else if (award_status === 0 || award_status === 2) {
          const index = noreceive.value.findIndex((s) => s === id);
          if (index !== -1) noreceive.value.splice(index, 1);
        }

        // 如果状态改变的任务和当前显示的任务为同一个，则请求该任务下各个阶段的奖励领取状态
        if (activeConfig.value.taskid === id) {
          fetchActiveAwards(id);
          consumed.value = _.toNumber(task_item.now_total_process);
        }

        // 如果当前显示的礼包没有购买，则将进度置为0
        if (!bought.value.includes(activeID.value)) {
          activeAwards.value = [];
          consumed.value = 0;
        }
      }
    });

    SKT_NOTIFY_PAY_ORDER_MSG(({ goods_id }) => {
      const list = YIBENWANLI.map((e) => e.id);
      if (list.includes(goods_id)) {
        getFullStatus();
        fetchActiveAwards(activeConfig['value']['taskid']);
      }
    });

    return {
      dataList: YIBENWANLI,
      visibleRuleTip: ref(false),
      activeID,
      bought,
      noreceive,
      activeConfig,
      getFullStatus,
      getNoreceive,
      activeStatus,
      activeAwards,
      cutdown,
      consumed,
    };
  },

  mounted() {
    setTimeout(() => {
      new BScroll(this.$refs.BetterScroll as HTMLDivElement, { click: true });
      new BScroll(this.$refs.TaskScroll as HTMLDivElement, { click: true });
    }, 300);
  },

  methods: {
    payHandler() {
      if (this.bought.includes(this.activeConfig.id)) alertMsg('本期该礼包您已购买');
      else payPanel(this.activeConfig.id, this.activeConfig.price);
    },

    fetchAward(level: number) {
      API_GET_TASK_AWARD_NEW(this.activeConfig.taskid, level);
    },

    goTask() {
      if (this.bought.includes(this.activeID)) {
        alertMsg('请前往捕鱼场完成任务');
      } else {
        alertMsg('购买礼包后任务解锁');
      }
    },
  },
});
</script>
<style lang="scss" scoped src="./index.scss" />
