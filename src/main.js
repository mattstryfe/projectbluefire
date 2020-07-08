import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import dayjs from 'dayjs'
import VueGeolocation from "vue-browser-geolocation/src";

import './styles/custom-global.css'

Vue.config.productionTip = false
Vue.prototype.dayjs = dayjs
Vue.use(VueGeolocation)


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
