<template>
  <teleport to="#app">
    <div v-if="modalVisible === 'block'" class="modal" :style="{ display: modalVisible }">
      <!-- 太阳光旋转动画背景 -->
      <div v-center class="animate"></div>
      <!-- 主体内容 -->
      <div class="main">
        <!-- 恭喜获得 -->
        <div class="title"></div>
        <!-- 资产 -->
        <div class="asset">
          <div class="content">
            <img class="icon" :src="iconSrc" alt="资产" />
            <span class="count">x{{ convert(notifyData.number) }}</span>
          </div>
          <span class="text">{{ notifyData.label }}</span>
        </div>
        <!-- 确定 -->
        <div class="confirm" @click="stackCutdown++"></div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { modalVisible, notifyData, stackCutdown } from '../composables/notify';

export default defineComponent({
  name: 'Modal',
  setup() {
    const iconSrc = ref('');

    watch(notifyData, (params) => {
      if (params) {
        iconSrc.value = process.env.VUE_APP_ASSET_URL + '/juhuasuan/image/' + params.icon;
      }
    });

    return {
      modalVisible,
      stackCutdown,
      notifyData,
      iconSrc,
    };
  },

  methods: {
    convert(value: number) {
      return this.addChineseUnit(value);
    },

    addWan: function (integer: number, number: number, mutiple: number, decimalDigit: number) {
      var digit = this.getDigit(integer);
      if (digit > 3) {
        var remainder = digit % 8;
        if (remainder >= 5) {
          // ‘十万’、‘百万’、‘千万’显示为‘万’
          remainder = 4;
        }
        return (
          Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit) + '万'
        );
      } else {
        return Math.round(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit);
      }
    },

    getDigit: function (integer: number) {
      var digit = -1;
      while (integer >= 1) {
        digit++;
        integer = integer / 10;
      }
      return digit;
    },

    addChineseUnit: function (number: number, decimalDigit?: number) {
      decimalDigit = decimalDigit || 2;
      var integer = Math.floor(number);
      var digit = this.getDigit(integer);
      // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
      var unit = [];
      if (digit > 3) {
        var multiple = Math.floor(digit / 8);
        if (multiple >= 1) {
          var tmp = Math.round(integer / Math.pow(10, 8 * multiple));
          unit.push(this.addWan(tmp, number, 8 * multiple, decimalDigit));
          for (var i = 0; i < multiple; i++) {
            unit.push('亿');
          }
          return unit.join('');
        } else {
          return this.addWan(integer, number, 0, decimalDigit);
        }
      } else {
        return number;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@keyframes loop {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

div.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

div.animate {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -97px;
  width: 199px;
  height: 194px;
  zoom: 6;
  // background-image: ;
  // background: linear-gradient(to bottom, rgba(79, 181, 226, 0), rgba(79, 181, 226, 1), rgba(79, 181, 226, 0)),
  //   linear-gradient(to right, rgba(79, 181, 226, 0), rgba(79, 181, 226, 1), rgba(79, 181, 226, 0)),
  //   url('../../../assets/image/shine02.png');
  background: radial-gradient(rgba(79, 181, 226, 1), transparent 70%, transparent),
    url('../../../assets/image/shine02.png');
  opacity: 0.6;
  background-size: contain;
  animation: loop 60s linear infinite;
}

div.main {
  position: absolute;
  z-index: 1;
  width: 1900px;
  height: 454px;
  background-image: url('../../../assets/image/com_bg_tips.png');
  background-size: contain;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  div.title {
    position: absolute;
    width: 498px;
    height: 134px;
    background-image: url('../../../assets/image/bt_1.png');
    background-size: contain;
    left: 50%;
    top: -70px;
    transform: translateX(-50%);
  }

  div.asset {
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%) scale(1.6);
    text-align: center;

    div.content {
      background-image: url('../../../assets/image/jhs_bg_6.png');
      background-size: contain;
      width: 144px;
      height: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;

      img.icon {
        width: 100px;
        height: 100px;
      }

      span.count {
        color: white;
        font-size: 30px;
        font-weight: 600;
        transform: translateY(-7px);
      }
    }

    span.text {
      color: white;
      font-size: 30px;
    }
  }

  div.confirm {
    position: absolute;
    left: 50%;
    bottom: -180px;
    transform: translateX(-50%);
    width: 315px;
    height: 122px;
    background-image: url('../../../assets/image/btn_1.png');
    background-size: contain;
  }
}
</style>
