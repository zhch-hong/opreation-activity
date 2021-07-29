<template>
  <div class="container" @click="submit"></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { API_GET_TASK_AWARD } from '@/api';
import { SYSTEM_UPGRADE } from '@/shopping';
import alertMessage from '@/components/alert';
import { SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/api-socket';

export default defineComponent({
  setup() {
    SKT_NOTIFY_ASSET_CHANGE_MSG();
  },

  methods: {
    submit() {
      API_GET_TASK_AWARD(SYSTEM_UPGRADE).then(({ result }) => {
        if (result !== 0) {
          alertMessage(`[${result}]领取失败`);
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background: url('./image/system_upgrade.png') center/cover no-repeat;
}
</style>
