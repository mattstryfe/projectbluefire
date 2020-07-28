import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

// Leaflet import for component level integration
import 'leaflet/dist/leaflet.css'

// DayJS
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
Vue.prototype.dayjs = dayjs.extend(relativeTime)

// Required for browser geo lookup
import VueGeolocation from "vue-browser-geolocation/src";
Vue.use(VueGeolocation)

// Custom Styles
import './styles/custom-global.css'

// Not sure wtf this does
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
