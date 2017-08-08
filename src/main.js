// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import VueFire from 'vuefire'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import Home from './components/Home'
import Leaderboard from './components/Leaderboard'
import Upload from './components/Upload'

Vue.use(VueFire)
Vue.use(Vuetify)
Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/Leaderboard', name: 'leaderboard', component: Leaderboard },
  { path: '/Upload', name: 'upload', component: Upload },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

/* eslint-disable no-new */
new Vue({
  router,
  template: '<v-app><app></app></v-app>',
  components: { App }
}).$mount('#app')
