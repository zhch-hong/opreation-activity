import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import SYS_ACT_BASE_NORMAL_WEB from '@/views/multi-nav/multi-nav.vue';
import ACT_004_JIKA_WEB from '@/views/zhizunjika/zhizunjika.vue';
import GIFT_10087_WEB from '@/views/meiritehui/meiritehui.vue';
import ACT_035_YBWL_WEB from '@/views/yibenwanli/yibenwanli.vue';
import ACT_022_QFLB_WEB from '@/views/quanfanlibao/quanfanlibao.vue';
import ACT_016_XYXCWK_WEB from '@/views/changwanka/changwanka.vue';
import SYS_SCLB_WEB from '@/views/shouchonglibao/shouchonglibao.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/sys_act_base_normal_web',
  },
  {
    path: '/sys_act_base_normal_web',
    name: '活动',
    component: SYS_ACT_BASE_NORMAL_WEB,
  },
  {
    path: '/act_004_jika_web',
    name: '至尊季卡',
    component: ACT_004_JIKA_WEB,
  },
  {
    path: '/gift_10087_web',
    name: '每日特惠',
    component: GIFT_10087_WEB,
  },
  {
    path: '/act_035_ybwl_web',
    name: '一本万利',
    component: ACT_035_YBWL_WEB,
  },
  {
    path: '/sys_sclb_web',
    name: '首充礼包',
    component: SYS_SCLB_WEB,
  },
  {
    path: '/act_022_qflb_web',
    name: '全返礼包',
    component: ACT_022_QFLB_WEB,
  },
  {
    path: '/act_016_xyxcwk_web',
    name: '小游戏畅玩卡',
    component: ACT_016_XYXCWK_WEB,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
