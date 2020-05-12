import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import dayjs from 'dayjs'

Vue.config.productionTip = false
Vue.prototype.dayjs = dayjs


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
