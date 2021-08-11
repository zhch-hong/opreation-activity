<template>
  <div class="lucky-wheel">
    <div ref="LuckyWheel" class="wheel-box"></div>
    <!-- 闪烁的圆珠 -->
    <div class="anmt-1"></div>
    <div class="anmt-2"></div>
    <div class="anmt-3"></div>
    <div class="anmt-4"></div>
    <div class="anmt-5"></div>
    <div class="anmt-6"></div>
    <div class="anmt-7"></div>
    <div class="anmt-8"></div>
    <div class="anmt-9"></div>
    <div class="anmt-10"></div>
    <div class="anmt-11"></div>
    <div class="anmt-12"></div>
  </div>
</template>
<script>
import { LuckyWheel } from 'lucky-canvas';
import { API_JIKA_EVERYDAY_LOTTERY } from '@/vendors/api';

export default {
  props: {
    isLottery: Boolean,
    isBuyed: Boolean,
  },

  emits: ['lottery-resolve', 'pay-panel'],

  data() {
    return {
      luckyInstance: null,
      isLotterying: false,
    };
  },

  watch: {
    isLottery: {
      immediate: true,
      handler(value) {
        if (this.luckyInstance) {
          if (this.isLotterying) {
            setTimeout(() => {
              this.updateButtons(value);
            }, 7500);
          } else {
            setTimeout(() => {
              this.updateButtons(value);
            }, 300);
          }
        }
      },
    },
  },

  mounted() {
    this.luckyInstance = new LuckyWheel(
      {
        divElement: this.$refs.LuckyWheel,
        width: '28.28125vw',
        height: '28.28125vw',
        unitFunc: (num, unit) => {
          if (unit === 'vw') {
            return (window.innerWidth / 100) * num;
          }
        },
      },
      {
        blocks: [],
        defaultConfig: {
          stopRange: 0,
        },
        buttons: [
          { radius: '25%', background: 'rgba(255, 255, 255, 0.2)' },
          { radius: '22%', background: 'rgba(0, 0, 0, 0.2)' },
          {
            radius: '18%',
            background: '#e4c892',
            pointer: true,
            imgs: [{ src: require('./image/jk_btn_cj.png'), width: '100%', top: '-100%' }],
          },
        ],
        prizes: this.getPrizesList(),
        start: () => {
          if (!this.isBuyed) {
            this.$emit('pay-panel');
            return;
          }

          if (this.isLottery) return;

          this.isLotterying = true;

          this.luckyInstance.play();

          API_JIKA_EVERYDAY_LOTTERY().then(({ award_id }) => {
            setTimeout(() => {
              this.luckyInstance.stop(--award_id);
            }, 5000);
          });
        },
        end: (prize) => {
          this.$emit('lottery-resolve', prize);

          this.isLotterying = false;
        },
      }
    );
  },

  methods: {
    getPrizesList() {
      const prizes = [];
      const cfg = [
        { label: '40万鱼币', icon: 'ty_icon_yb_1' },
        { label: '1.98万福利券', icon: 'ty_icon_flq2' },
        { label: '45万鱼币', icon: 'ty_icon_yb_3' },
        { label: '50万金币', icon: 'com_pc_icon_jb1' },
        { label: '60万鱼币', icon: 'ty_icon_yb_3' },
        { label: '100话费碎片', icon: 'com_award_icon_hfsp' },
        { label: '500万鱼币', icon: 'ty_icon_yb_5' },
        { label: '1000万金币', icon: 'pay_icon_gold8' },
        { label: '30万鱼币', icon: 'ty_icon_yb_1' },
      ];
      cfg.forEach((item, index) => {
        prizes.push({
          title: item.label,
          background: index % 2 ? '#5b5fac' : '#3d2e6d',
          fonts: [{ text: item.label, top: '10%', fontColor: '#fff', fontStyle: 'FZY4JW', fontSize: '1.3vw' }],
          imgs: [{ src: require(`@/assets/image/${item.icon}.png`), width: '50%', top: '30%' }],
        });
      });
      return prizes;
    },

    updateButtons(value) {
      if (value) {
        this.luckyInstance.buttons = [
          {
            radius: '18%',
            background: '#e4c892',
            pointer: true,
            imgs: [{ src: require('./image/jk_btn_mrcj.png'), width: '100%', top: '-100%' }],
          },
        ];
      } else {
        this.luckyInstance.buttons = [
          { radius: '25%', background: 'rgba(255, 255, 255, 0.2)' },
          { radius: '22%', background: 'rgba(0, 0, 0, 0.2)' },
          {
            radius: '18%',
            background: '#e4c892',
            pointer: true,
            imgs: [{ src: require('./image/jk_btn_cj.png'), width: '100%', top: '-100%' }],
          },
        ];
      }
    },
  },
};
</script>
<style lang="scss" scoped src="./lucky-wheel.scss" />
