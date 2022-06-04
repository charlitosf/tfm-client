import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import PasswordsView from '../views/PasswordsView.vue'
import FilesView from '../views/FilesView.vue'
import ProfileView from '../views/ProfileView.vue'
import store from '@/store.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/passwords',
    name: 'passwords',
    component: PasswordsView
  },
  {
    path: '/files',
    name: 'files',
    component: FilesView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.name !== 'login' && to.name !== 'signup' && store.state.user.token === '') {
    next({ name: 'login' })
  } else next();
})

export default router
