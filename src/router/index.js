import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: '/',
  component: () => import('@/views/Test')
}, {
  path: '/jingfen',
  name: 'jingfen',
  component: () => import('@/views/Jingfen')
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
