import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/multi-nav',
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
