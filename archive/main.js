// import Vue from 'vue'
// import App from './App.vue'
// import router from './router'
// import store from './store'
// import vuetify from './plugins/vuetify'
// import GAuth from 'vue-google-oauth2'

// Socket things
// import VueSocketIOExt from 'vue-socket.io-extended'
// import io from 'socket.io-client'
// const socket = io('http://localhost:4001')
// Vue.use(VueSocketIOExt, socket)

// Leaflet import for component level integration
// import 'leaflet/dist/leaflet.css'
//
// // DayJS
// import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime';
// Vue.prototype.dayjs = dayjs.extend(relativeTime)
//
// // Required for browser geo lookup
// import VueGeolocation from "vue-browser-geolocation/src";
// Vue.use(VueGeolocation)
//
// // Custom Styles
// import './styles/custom-global.css'
//
//
// // Google OAUTH
// const gauthOption = {
//   clientId: '342995548873-g7smu4i2e082aku2j6rb4ksc3uvokn14.apps.googleusercontent.com',
//   scope: 'profile email',
//   prompt: 'select_account',
//   fetch_basic_profile: true
// }
//
// Vue.use(GAuth, gauthOption)
//
// new Vue({
//   router,
//   store,
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')
//

import { createApp } from 'vue'
import App from '@/App.vue'
import pinia from '@/plugins/pinia.js'
import router from '@/plugins/router.js'

import './assets/css/style.css'
import { vuetify } from '@/plugins/vuetify'
import { useUserStore } from '@/stores/userStore'

createApp(App).use(pinia).use(router).use(vuetify).mount('#app')

if (import.meta.env.MODE === 'development') {
  const userStore = useUserStore()
  userStore.handleLogin(true)
}
