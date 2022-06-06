import FeedViewVue from '@/views/FeedView.vue';
import HomeViewVue from '@/views/HomeView.vue';
import RegisterViewVue from '@/views/RegisterView.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeViewVue,
    props: true,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterViewVue,
  },
  {
    path: '/feed',
    name: 'feed',
    component: FeedViewVue,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
