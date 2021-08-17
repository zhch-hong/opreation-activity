<template>
  <div class="pay-panel">
    <main class="main">
      <div class="immediately">
        <div class="title" :style="{ 'margin-bottom': activeID === weeksID ? '2.6vw' : '2.6vw' }">购买立得</div>
        <!-- 10084，周返 -->
        <AwardTwoLeft v-if="activeID === weeksID" :icon="immediate.icon" :text="immediate.text" />
        <AwardThreeLeft v-else :icon="immediate.icon" :text="immediate.text" />
      </div>
      <img class="divider" src="../image/qflb_fgdk_fgx.png" alt="分割线" />
      <div class="award">
        <div class="title">连续{{ dayCount }}天每日领：</div>
        <div class="task-award">
          <TwoAward v-if="activeID === weeksID" :awards="taskAwards" />
          <ThreeAward v-else :awards="taskAwards" />
        </div>
      </div>
    </main>
    <footer class="footer">
      <button class="pay-btn" @click="submit">
        <img class="tag" src="../image/tag.png" alt="超值" />
        <span class="price">{{ price }}元购买</span>
      </button>
      <p v-if="showOnce" class="text1">限购一次</p>
      <p class="text2">温馨提示：本礼包不参与渠道活动</p>
    </footer>
  </div>
</template>
<script lang="ts">
import { T_AWARD_ITEM } from '@/vendors/shopping';
import { computed, defineComponent, ref, watch } from 'vue';
import { activeObserver } from '../composition';
import payPanel from '@/components/pay-panel';

import ThreeAward from './ThreeAward.vue';
import TwoAward from './TwoAward.vue';
import AwardTwoLeft from './AwardTwoLeft.vue';
import AwardThreeLeft from './AwardThreeLeft.vue';

export default defineComponent({
  name: '购买礼包',

  components: {
    ThreeAward,
    TwoAward,
    AwardTwoLeft,
    AwardThreeLeft,
  },

  setup() {
    const { activeID, activeConfig } = activeObserver();
    /** 限购一次 */
    const showOnce = ref(true);
    /** 立即获得的奖励 */
    const immediate = ref<T_AWARD_ITEM>(activeConfig.value.immediately);
    /** 每日任务获得的奖励 */
    const awardList = ref<T_AWARD_ITEM[]>(activeConfig.value.taskAwards);
    const dayCount = ref(7);

    watch(
      activeConfig,
      (object) => {
        const { id, immediately, taskAwards } = object;

        if (id === 10084) dayCount.value = 7;
        if (id === 10085) dayCount.value = 30;
        if (id === 10086) dayCount.value = 90;

        showOnce.value = id === 10084; // 10084，周返礼包ID
        immediate.value = immediately;
        awardList.value = taskAwards;
      },
      { immediate: true }
    );

    return {
      activeID,
      showOnce,
      immediate,
      dayCount,
      taskAwards: awardList,
      weeksID: 10084,
      price: computed(() => activeConfig.value.price),
    };
  },

  methods: {
    submit() {
      payPanel(this.activeID, this.price);
    },
  },
});
</script>
<style lang="scss" scoped>
.pay-panel {
  position: absolute;
  top: 350px;
  left: 400px;
  width: 1100px;
  height: 640px;

  .main {
    height: 370px;
    display: flex;

    .immediately {
      text-align: center;

      .title {
        display: inline-block;
        width: 240px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        background: linear-gradient(to right, rgba(59, 241, 239, 0), #3bf1ef, rgba(59, 241, 239, 0));
        color: #fff;
        text-shadow: 0 1px #1d71cf, 1px 0 #1d71cf, -1px 0 #1d71cf, 0 -1px #1d71cf;
        -webkit-text-stroke: 0.3px #1d71cf;
      }
    }

    .divider {
      margin: 0 20px;
      width: 4px;
      height: 128px;
      transform: scaleY(2);
      transform-origin: bottom center;
      align-self: flex-end;
    }

    .award {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      text-align: center;

      .title {
        align-self: center;
        display: inline-block;
        width: 450px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        margin-bottom: 20px;
        background: linear-gradient(to right, rgba(59, 241, 239, 0), #3bf1ef, rgba(59, 241, 239, 0));
        color: #fff;
        text-shadow: 0 1px #1d71cf, 1px 0 #1d71cf, -1px 0 #1d71cf, 0 -1px #1d71cf;
        -webkit-text-stroke: 0.3px #1d71cf;
      }

      .task-award {
        flex-grow: 1;
      }
    }
  }

  .footer {
    margin-top: 20px;
    text-align: center;

    .pay-btn {
      position: relative;
      border: none;
      width: 342px;
      height: 132px;
      font-size: 56px;
      color: #fff;
      background: url('../image/ty_btn_huang1.png') center/contain no-repeat;

      .tag {
        position: absolute;
        width: 144px;
        height: 114px;
        top: -12px;
        left: -10px;
      }

      .price {
        white-space: nowrap;
      }
    }

    .text1,
    .text2 {
      margin: 6px 0;
      color: #fff;
    }
  }
}
</style>
