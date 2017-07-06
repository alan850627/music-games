// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import VueFire from 'vuefire'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from './App'

/*
 * Because we installed VueFire via npm and imported it as a module, we have
 * to add this little snippet of code to 'install' it. If you include the lib
 * via typical <script> tags in your HTML document, this isn't required.
 */

Vue.use(VueFire)
Vue.use(VueMaterial)
Vue.material.registerTheme('green', {
  primary: {
    color: 'black',
    hue: 300
  },
  accent: {
    color: 'red',
    hue: 300
  },
  warn: {
    color: 'red',
    hue: 300
  },
  background: {
    color: 'light-green',
    hue: 200
  }
})

Vue.material.registerTheme('question', {
  primary: 'black',
  accent: 'green',
  warn: 'red',
  background: 'white'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
