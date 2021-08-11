<template>
  <div class="task-row">
    <Row style="height: 100%">
      <Col span="16">
        <div class="progress">
          <p class="title">{{ data.text }}</p>
          <div class="bottom">
            <div class="scroll-warp">
              <div class="scroll-bar" :style="{ width: barWidth }"></div>
              <span class="count">{{ tranNumber(data.progress) }}/{{ tranNumber(data.total) }}</span>
            </div>
            <template v-if="data.taskid !== 21319 && statusRef === 0">
              <button class="refresh" @click="$emit('refresh')"></button>
              <span v-if="showRefreshSub" class="tip">（3万金币）</span>
            </template>
          </div>
        </div>
      </Col>
      <Col span="3">
        <div class="award">
          <img v-if="awardIcon" class="icon" :src="require('../image/' + awardIcon + '.png')" alt="奖励icon" />
          <p class="text">{{ awardText }}</p>
        </div>
      </Col>
      <Col span="5">
        <div class="handler">
          <button class="submit" :style="{ 'background-image': submitImage }" @click="submit"></button>
          <p class="count">剩余{{ data.remainNum }}次</p>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, toRefs, watch } from 'vue';

import { Col, Row } from 'vant';
import 'vant/es/row/style';
import 'vant/es/col/style';

import composition, { T_TASK_ROW } from '../composition';
import { tranNumber } from '@/utils/transform-unit';
import alertMsg from '@/components/alert';
import { API_GET_TASK_AWARD } from '@/vendors/api';

export default defineComponent({
  components: {
    Col,
    Row,
  },

  props: {
    data: {
      type: Object as PropType<T_TASK_ROW>,
      required: true,
    },
  },

  emits: ['refresh', 'award-done'],

  setup(props) {
    const { showRefreshSub, fetchChangwanka } = composition();
    const { total, progress, status, awardIcon, awardText } = toRefs(props.data);
    const barWidth = ref('0');
    const submitImage = ref('');
    const statusRef = ref(0);

    watch(
      [progress, total, status],
      ([p, t, s]) => {
        // 进度条
        if (p > t) p = t;
        barWidth.value = (p / t) * 100 + '%';

        statusRef.value = s;

        // 按钮图
        if (s === 0) submitImage.value = `url(${require('../image/qianwang.png')})`;
        else if (s === 1) submitImage.value = `url(${require('../image/lingqu.png')})`;
        else if (s === 2) submitImage.value = `url(${require('../image/yilingqu.png')})`;
      },
      { immediate: true }
    );

    return {
      tranNumber,
      barWidth,
      submitImage,
      awardIcon,
      awardText,
      statusRef,
      showRefreshSub,
      fetchChangwanka,
    };
  },

  methods: {
    submit() {
      if (this.statusRef === 2) return;

      if (this.statusRef === 0) {
        alertMsg('请前往游戏完成任务');
        return;
      }

      API_GET_TASK_AWARD(this.data.taskid).then(() => {
        this.$emit('award-done');
        setTimeout(() => {
          this.fetchChangwanka();
        }, 1000);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.task-row {
  height: 164px;
  background: url('../image/task_row.png') center/contain no-repeat;
  margin-bottom: 40px;
}

.progress {
  padding-left: 30px;
  .title {
    margin: 30px 0 18px;
    color: #276199;
    font-size: 34px;
  }

  .bottom {
    display: flex;
    align-items: center;

    .scroll-warp {
      position: relative;
      display: inline-block;
      width: 400px;
      height: 40px;
      overflow: hidden;
      border-radius: 20px;
      background-color: rgba($color: #4483a5, $alpha: 0.5);

      .scroll-bar {
        height: 100%;
        background-color: #f7c638;
        width: 30%;
      }

      .count {
        position: absolute;
        white-space: nowrap;
        color: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .refresh {
      margin-left: 20px;
      border: unset;
      width: 132px;
      height: 55px;
      background: url('../image/refresh.png') center/contain no-repeat;
    }

    .tip {
      color: #39b4fd;
    }
  }
}

.award {
  width: 141px;
  height: 141px;
  margin: 10px auto 0 auto;
  background: url('../image/award.png') center/contain no-repeat;

  .icon {
    position: relative;
    top: 16px;
    max-width: 70%;
    max-height: 50%;
    display: block;
    margin: 0 auto;
  }

  .text {
    position: relative;
    top: 35px;
    color: #fff;
    font-size: 26px;
    text-align: center;
    margin: 0;
  }
}

.handler {
  text-align: center;
  margin-top: 30px;

  .submit {
    border: unset;
    width: 212px;
    height: 83px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: transparent;
  }
  .count {
    margin: 0;
    color: #39b4fd;
  }
}
</style>
