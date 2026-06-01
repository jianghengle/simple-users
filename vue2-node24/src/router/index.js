import Vue from 'vue'
import VueRouter from 'vue-router'
import MyHome from '../views/MyHome.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'MyHome',
      component: MyHome
    },
    {
      path: '/groups',
      name: 'MyGroups',
      component: () => import('../views/MyGroups.vue')
    },
    {
      path: '/group/:groupName',
      name: 'MyGroup',
      component: () => import('../views/MyGroup.vue')
    },
    {
      path: '/mail-server',
      name: 'MyServer',
      component: () => import('../views/MyServer.vue')
    },
  ]
})

export default router
