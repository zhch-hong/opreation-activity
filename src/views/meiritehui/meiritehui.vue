<template>
  <div class="container">
    <!-- 关闭按钮 -->
    <a class="close" href="uniwebviewfun://Hide">
      <img src="@/assets/image/close_2.png" alt="关闭" />
    </a>

    <p class="tip">每日特惠礼包每天只能购买一次</p>

    <div class="pay-list">
      <PayItem
        v-for="(item, i) of list"
        :ref="'PayItem_' + i"
        :key="item.id"
        :index="i"
        :gift="item"
        :update-status="updateStatus"
        @update-status="updateStatus = false"
      />
    </div>
  </div>
</template>
<script lang="ts">
import _ from 'lodash';
import { defineComponent, ref } from 'vue';
import { MEIRITEHUI, T_MEIRITEHUI } from '@/vendors/shopping';
import { API_CHECK_PERMISS } from '@/vendors/api';
import { SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/vendors/api-socket';

import PayItem from './components/PayItem.vue';

function getLevelData() {
  const data = ref<T_MEIRITEHUI[]>([]);
  const clone = _.cloneDeep(MEIRITEHUI);
  const promiseList: Array<Promise<Record<'result', boolean>>> = [];
  MEIRITEHUI.forEach((item) => promiseList.push(API_CHECK_PERMISS(`actp_buy_gift_bag_${item[0].id}`)));
  Promise.all(promiseList).then((value) => {
    value.forEach((v, i) => {
      console.log(clone[i][0].id, v, clone[i]);
    });

    const index = value.reverse().findIndex((item) => item.result);
    if (index !== -1) {
      const element = clone.reverse()[index];
      data.value = element;
    }
  });

  return data;
}

export default defineComponent({
  components: { PayItem },

  setup() {
    const updateStatus = ref(true);

    SKT_NOTIFY_ASSET_CHANGE_MSG(() => {
      updateStatus.value = true;
    });

    return {
      updateStatus,
      list: getLevelData(),
    };
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
