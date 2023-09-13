import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const routes = [
  {
    path: '/SimplePlayer',
    name: 'simplePlayer',
    component: () => import( '@/pages/SimplePlayer.vue'),
  },
  {
    path: '/MusicPlayer',
    name: 'musicPlayer',
    component: () => import( '@/pages/MusicPlayer.vue'),
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})


export default router