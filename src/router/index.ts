import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import _ from 'lodash';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/shouchonglibao',
  },
  {
    path: '/multi-nav',
    name: '活动',
    component: () => import('@/views/multi-nav/multi-nav.vue'),
  },
  {
    path: '/zhizunjika',
    name: '至尊季卡',
    component: () => import('@/views/zhizunjika/zhizunjika.vue'),
  },
  {
    path: '/meiritehui',
    name: '每日特惠',
    component: () => import('@/views/meiritehui/meiritehui.vue'),
  },
  {
    path: '/yibenwanli',
    name: '一本万利',
    component: () => import('@/views/yibenwanli/yibenwanli.vue'),
  },
  {
    path: '/shouchonglibao',
    name: '首充礼包',
    component: () => import('@/views/shouchonglibao/shouchonglibao.vue'),
  },
  {
    path: '/quanfanlibao',
    name: '全返礼包',
    component: () => import('@/views/quanfanlibao/quanfanlibao.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
