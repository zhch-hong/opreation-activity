import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/sys_act_base_normal_web',
  },
  {
    path: '/sys_act_base_normal_web',
    name: '活动',
    component: () => import('@/views/multi-nav/multi-nav.vue'),
  },
  // {
  //   path: '/act_004_jika_web',
  //   name: '至尊季卡',
  //   component: () => import('@/views/zhizunjika/zhizunjika.vue'),
  // },
  {
    path: '/gift_10087_web',
    name: '每日特惠',
    component: () => import('@/views/meiritehui/meiritehui.vue'),
  },
  {
    path: '/act_035_ybwl_web',
    name: '一本万利',
    component: () => import('@/views/yibenwanli/yibenwanli.vue'),
  },
  {
    path: '/sys_sclb_web',
    name: '首充礼包',
    component: () => import('@/views/shouchonglibao/shouchonglibao.vue'),
  },
  {
    path: '/act_022_qflb_web',
    name: '全返礼包',
    component: () => import('@/views/quanfanlibao/quanfanlibao.vue'),
  },
  {
    path: '/act_016_xyxcwk_web',
    name: '小游戏畅玩卡',
    component: () => import('@/views/changwanka/changwanka.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
