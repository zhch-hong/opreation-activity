import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/meiritehui',
  },
  {
    path: '/multi-nav',
    name: '活动',
    component: () => import('@/views/multi-nav/index.vue'),
  },
  {
    path: '/zhizunjika',
    name: '至尊季卡',
    component: () => import('@/views/zhizunjika/index.vue'),
  },
  {
    path: '/meiritehui',
    name: '每日特惠',
    component: () => import('@/views/meiritehui/index.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
