import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
          path: 'app_test',
          name: 'adminAppTest',
          component: () => import('@/views/admin/apps/test.vue')
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
