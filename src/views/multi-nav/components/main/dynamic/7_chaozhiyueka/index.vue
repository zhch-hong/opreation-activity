<template>
  <div class="container">
    <div class="item">
      <HaohuaYueka :base-data="baseData" />
    </div>
    <div class="item">
      <ZhizunJika v-if="showJika" :base-data="baseData" />
      <ZunxiangYueka v-else :base-data="baseData" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import { API_QUERY_NEW_YUEKA_BASE_INFO, API_QUERY_JIKA_BASE_INFO } from '@/api';

import HaohuaYueka from './components/haohuayueka/index.vue';
import ZunxiangYueka from './components/zunxiangyueka/index.vue';
import ZhizunJika from './components/zhizunjika/index.vue';
import { SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/api-socket';

function fetchInfo() {
  return Promise.all([API_QUERY_NEW_YUEKA_BASE_INFO(), API_QUERY_JIKA_BASE_INFO()]);
}

export default defineComponent({
  name: '超值月卡',

  components: {
    HaohuaYueka,
    ZunxiangYueka,
    ZhizunJika,
  },

  setup() {
    const baseData = ref({});
    const showJika = ref(false);

    const cb = () => {
      fetchInfo().then(([YK, JK]) => {
        baseData.value = YK;

        if (YK.total_remain_num_2 > 0 && JK.total_remain_num === 0) showJika.value = true;
        else showJika.value = false;
      });
    };
    SKT_NOTIFY_ASSET_CHANGE_MSG(cb);

    fetchInfo().then(([YK, JK]) => {
      baseData.value = YK;

      if (YK.total_remain_num_2 > 0 && JK.total_remain_num === 0) showJika.value = true;
      else showJika.value = false;
    });

    return {
      showJika,
      baseData,
    };
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
