<template>
  <teleport to="body">
    <div class="route-nav">
      <router-link class="route-link" :to="{ path: '/sys_act_base_normal_web', query: { token } }"
        >活动导航</router-link
      >
      <!-- <Divider />
      <router-link class="route-link" :to="{ path: '/act_004_jika_web', query: { token } }">至尊季卡</router-link> -->
      <Divider />
      <router-link class="route-link" :to="{ path: '/gift_10087_web', query: { token } }">每日特惠</router-link>
      <Divider />
      <router-link class="route-link" :to="{ path: '/act_035_ybwl_web', query: { token } }">一本万利</router-link>
      <Divider />
      <router-link class="route-link" :to="{ path: '/sys_sclb1_web', query: { token } }">首充礼包</router-link>
      <Divider />
      <router-link class="route-link" :to="{ path: '/act_022_qflb_web', query: { token } }">全返礼包</router-link>
      <Divider />
      <router-link class="route-link" :to="{ path: '/act_016_xyxcwk_web', query: { token } }">畅玩卡</router-link>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { Divider } from 'vant';
import 'vant/es/divider/style';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: '导航菜单',

  components: { Divider },

  setup() {
    const route = useRoute();
    const token = ref('');

    onMounted(() => {
      setTimeout(() => {
        token.value = route.query.token as string;
      }, 300);
    });

    return {
      token,
    };
  },
});
</script>

<style lang="scss" scoped>
.route-nav {
  position: fixed;
  left: 20px;
  top: 80px;
  z-index: 1000;
  background-color: rgba(0, 153, 255, 0.5);
  border-radius: 6px;
  overflow: hidden;
  padding: 16px 30px;

  .route-link {
    color: #fff;
  }
}
</style>
