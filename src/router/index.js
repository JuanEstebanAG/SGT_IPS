import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UbicacionesView from '../views/UbicacionesView.vue'
import ResponsablesView from '../views/ResponsablesView.vue'
import EquiposView from '../views/EquiposView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/ubicaciones',
      name: 'ubicaciones',
      component: UbicacionesView
    },
    {
      path: '/responsables',
      name: 'responsables',
      component: ResponsablesView
    },
    {
      path: '/equipos',
      name: 'equipos',
      component: EquiposView
    }
  ]
})

export default router