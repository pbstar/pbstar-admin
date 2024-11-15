import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/404/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/:pathMatch(.*)', component: NotFound },
    {
      path: '/',
      name: 'home',
      redirect: '/admin/home'
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/home',
      component: () => import('@/views/admin/index.vue'),
      children:[
        {
          path: 'home',
          name: 'adminHome',
          component: () => import('@/views/admin/home/index.vue')
        },
        {
          path: 'app_template',
          name: 'adminAppTemplate',
          component: () => import('@/views/admin/apps/template.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    }
  ]
})

export default router
