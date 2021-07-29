import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import _ from 'lodash';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/yibenwanli',
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
  {
    path: '/yibenwanli',
    name: '一本万利',
    component: () => import('@/views/yibenwanli/index.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
