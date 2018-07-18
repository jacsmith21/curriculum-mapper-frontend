import Vue from 'vue'
import App from './App'
import { router } from '@/router'
import store from '@/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueLodash from 'vue-lodash'
import '@/main.css'
import axios from 'axios'

// noinspection JSUnresolvedFunction
Vue.use(Vuetify)
Vue.use(VueLodash)

Vue.config.productionTip = false

// automatically set authorization token
const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
}

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
