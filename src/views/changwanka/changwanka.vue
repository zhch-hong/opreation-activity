<template>
  <TaskPanel v-if="boughtStatus" />
  <NotBought v-else />
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue';
import composition from './composition';

import NotBought from './components/NotBought.vue';
import TaskPanel from './components/TaskPanel.vue';
import { SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/vendors/api-socket';

export default defineComponent({
  components: {
    NotBought,
    TaskPanel,
  },

  setup() {
    const { boughtStatus, fetchChangwanka, fetchTaskTop, fetchTaskMid, fetchTaskBot } = composition();

    SKT_NOTIFY_ASSET_CHANGE_MSG();

    const stopWatch = watch(
      boughtStatus,
      (value) => {
        if (value) {
          fetchChangwanka();
          fetchTaskTop();
          fetchTaskMid();
          fetchTaskBot();

          stopWatch();
        }
      },
      { immediate: true }
    );

    return {
      boughtStatus,
    };
  },
});
</script>
