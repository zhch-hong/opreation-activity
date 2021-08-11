<template>
  <div class="task-panel">
    <main class="main">
      <div class="award-list">
        <div v-for="(item, index) in activeConfig.taskAwards" :key="index" class="item-box">
          <AwardItem :icon="item.icon" :text="item.text" />
        </div>
      </div>
      <div class="progress">
        <div class="scroll-wrap">
          <div class="scroll-bar" :style="{ width }"></div>
          <span class="text">{{ tranNumber(localProgress) }}/{{ tranNumber(activeConfig.needProcess) }}</span>
        </div>
        <span class="tip">次日清零</span>
      </div>
    </main>
    <footer class="footer">
      <p class="cutdown">剩余领取天数：{{ cutdown }}天</p>
      <button class="submit" :style="{ 'background-image': backImage }" @click="submit">{{ submitText }}</button>
    </footer>
  </div>
</template>
<script lang="ts">
import { tranNumber } from '@/utils/transform-unit';
import { defineComponent, ref, watch } from 'vue';
import { activeObserver } from '../composition';
import alertMsg from '@/components/alert';

import AwardItem from './AwardItem.vue';
import { API_GET_TASK_AWARD } from '@/vendors/api';

export default defineComponent({
  components: {
    AwardItem,
  },

  setup() {
    const { activeConfig, progress, cutdown, awardStatus, queryAll } = activeObserver();
    const width = ref('0px');
    const localProgress = ref(progress.value);
    const submitText = ref('');
    const backImage = ref('');

    watch(
      [() => activeConfig.value.needProcess, progress, awardStatus],
      ([n, p, s]) => {
        if (n <= p) {
          width.value = '100%';
          localProgress.value = n;
        } else {
          width.value = (p / n) * 100 + '%';
          localProgress.value = p;
        }

        if (s === 0) {
          submitText.value = '去完成';
          backImage.value = `url(${require('../image/ty_btn_huang1.png')})`;
        } else if (s === 1) {
          submitText.value = '领取';
          backImage.value = `url(${require('../image/ty_btn_huang1.png')})`;
        } else if (s === 2) {
          submitText.value = '今日已完成';
          backImage.value = `url(${require('../image/ty_btn_huang2.png')})`;
        }
      },
      { immediate: true }
    );

    return {
      activeConfig,
      tranNumber,
      localProgress,
      width,
      cutdown,
      submitText,
      awardStatus,
      backImage,
      queryAll,
    };
  },

  methods: {
    submit() {
      if (this.awardStatus === 0) {
        alertMsg('请前往游戏完成任务');
        return;
      }

      if (this.awardStatus === 1) {
        API_GET_TASK_AWARD(this.activeConfig.taskid).then(() => {
          this.queryAll();
        });
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.task-panel {
  position: absolute;
  top: 350px;
  left: 400px;
  width: 1100px;
  height: 640px;

  .main {
    display: flex;
    flex-direction: column;
    height: 370px;

    .award-list {
      display: flex;
      padding-top: 30px;
      justify-content: space-around;

      .item-box {
        display: inline-block;
      }
    }

    .progress {
      box-sizing: border-box;

      position: relative;
      flex-grow: 1;
      text-align: center;

      .scroll-wrap {
        position: relative;
        margin-top: 25px;
        display: inline-block;
        height: 61px;
        border-radius: 31px;
        width: 600px;
        background-color: rgba($color: #000000, $alpha: 0.3);
        overflow: hidden;

        .scroll-bar {
          height: 100%;
          background-color: #edc719;
        }

        .text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 40px;
          color: #fff;
        }
      }
      .tip {
        color: #fff;
        vertical-align: 18px;
        margin-left: 6px;
        font-size: 42px;
      }
    }
  }

  .footer {
    text-align: center;

    .cutdown {
      margin: 0;
      font-size: 50px;
      color: #fff;
      text-shadow: 0 1px #648aac, 1px 0 #648aac, -1px 0 #648aac, 0 -1px #648aac;
      -webkit-text-stroke: 0.3px #648aac;
    }

    .submit {
      margin-top: 30px;
      border: none;
      width: 342px;
      height: 132px;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      background-color: unset;
      font-size: 56px;
      color: #fff;
    }
  }
}
</style>
