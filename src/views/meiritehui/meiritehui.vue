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
import { defineComponent, ref } from 'vue';
import { MEIRITEHUI, T_MEIRITEHUI } from '@/shopping';
import { API_CHECK_PERMISS } from '@/api';
import _ from 'lodash';

import PayItem from './components/PayItem.vue';
import { SKT_NOTIFY_ASSET_CHANGE_MSG } from '@/api-socket';

function getLevelData() {
  const data = ref<T_MEIRITEHUI[]>([]);
  const clone = _.cloneDeep(MEIRITEHUI);
  const fun = function (array: Array<Array<T_MEIRITEHUI>>) {
    const el = array.shift();
    if (el) {
      API_CHECK_PERMISS('actp_buy_gift_bag_' + el[0]['id']).then((value) => {
        if (value.result) data.value = el;
        else fun(array);
      });
    }
  };
  fun(clone);

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
      list: getLevelData(),
      updateStatus: ref(true),
    };
  },
});
</script>

<style lang="scss" scoped src="./index.scss" />
