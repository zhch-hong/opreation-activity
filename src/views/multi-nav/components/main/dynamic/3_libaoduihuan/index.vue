<template>
  <img class="lbdy" src="./image/btn_1.png" alt="礼包兑换" @click="duihuan" />
  <OverlayDialog :visible="visible" @close="visible = false">
    <template #title>
      <span>礼包兑换</span>
    </template>
    <div class="main">
      <input
        v-model.trim="giftCode"
        :disabled="disable"
        ref="CodeInput"
        class="input"
        maxlength="10"
        type="text"
        placeholder="请输入礼包兑换码"
      />

      <span v-if="invalid" class="invalid">兑换码格式错误</span>
      <span v-if="disable" class="disable">
        连续输入错误次数已达上限，请稍后
        <b>({{ timedown }})</b>
      </span>

      <button class="button" @click="submit">兑&nbsp;&nbsp;换</button>
    </div>
  </OverlayDialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch, watchEffect } from 'vue';
import { fetchCall } from '@/network';
import { parseTimestamp } from '@/utils/stamp2hms';
import alertMessage from '@/components/alert';
import { addListenMsg, removeListenMsg } from '@/components/asset-notify';

import OverlayDialog from '@/components/overlay-dialog/index.vue';

function cutdown(count: number) {
  const time = ref('');
  const timestamp = ref(count);

  watchEffect(() => (time.value = parseTimestamp(timestamp.value)));

  const timer = setInterval(() => {
    timestamp.value--;
  }, 1000);

  return { time, timer };
}

export default defineComponent({
  components: {
    OverlayDialog,
  },

  setup() {
    const visible = ref(false);
    const timedown = ref('');

    return {
      visible,
      timedown,
    };
  },

  mounted() {
    addListenMsg();
  },

  beforeUnmount() {
    removeListenMsg();
    clearInterval(this.timer);
  },

  data() {
    return {
      timer: -1,
      giftCode: '',
      invalid: false,
      disable: false,
    };
  },

  methods: {
    duihuan() {
      this.visible = true;
    },

    validate(): boolean {
      if (this.giftCode.length < 6) return false;

      if (/\W|_/.test(this.giftCode)) return false;

      return true;
    },

    submit() {
      if (this.validate()) {
        fetchCall<Record<'result' | 'time', number>>('use_redeem_code', { code: this.giftCode }).then(
          ({ result, time }) => {
            if (result === 0) {
              this.visible = false;
              this.giftCode = '';
            } else {
              if (time !== 0) {
                alertMessage('你操作错误过多，稍后再试');
                this.disable = true;

                clearInterval(this.timer);

                const refCut = cutdown(time);

                this.timer = refCut.timer;

                watch(
                  refCut.time,
                  (value) => {
                    this.timedown = value;
                    if (value === '') {
                      this.disable = false;
                    }
                  },
                  { immediate: true }
                );
              } else {
                alertMessage('兑换码无效');
              }
            }
          }
        );
      } else {
        this.invalid = true;

        (this.$refs.CodeInput as HTMLInputElement).addEventListener(
          'focus',
          () => {
            this.invalid = false;
          },
          { once: true }
        );
      }
    },
  },
});
</script>
<style lang="scss" scoped src="./index.scss" />
