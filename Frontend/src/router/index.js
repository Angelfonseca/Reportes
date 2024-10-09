import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    name: 'login',
    component: LoginView, 
    },
    {
    path: '/consulta',
    name: 'consulta',
    component: () => import('../views/ConsultsView.vue')
    },
    {
    path: '/reporte',
    name: 'reporte',
    component: () => import('../views/CreateReport.vue')
    },
    {
    path: '/subir',
    name: 'subir',
    component: () => import('../views/AddUsers.vue')
    },
    {
    path: '/modificar',
    name: 'modificar',
    component: () => import('../views/ModifyUser.vue')
    },
    {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../views/UnauthorizedView.vue')
    },
    {
      path: '/configure',
      name: 'configure',
      component: () => import('../views/ConfigView.vue')
    },
    {
    path: '/404',
    name: 'NotFoundView',
    component: () => import('../views/NotFoundView.vue')
    },
    {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
    }
  ]
})

export default router