import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  {
    path: '/iframeChannel',
    name: 'iframeChannel',
    component: () => import('../views/IframeChannel.vue'),
  },
  {
    path: '/broadcastChannel',
    name: 'broadcastChannel',
    component: () => import('../views/BroadcastChannel.vue'),
  },
  {
    path: '/broadcastChannelChild',
    name: 'broadcastChannelChild',
    component: () => import('../views/BroadcastChannelChild.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
