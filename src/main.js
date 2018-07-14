import Vue from 'vue'
import App from './App'
import { router } from '@/router'
import store from '@/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueLodash from 'vue-lodash'

// noinspection JSUnresolvedFunction
Vue.use(Vuetify)
Vue.use(VueLodash)

Vue.config.productionTip = false

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
