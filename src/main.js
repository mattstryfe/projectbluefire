import { createApp } from 'vue'
import App from './App.vue'
import pinia from '@/plugins/pinia.js'
import router from '@/plugins/router.js'
import './assets/css/style.css'
import { vuetify } from '@/plugins/vuetify'
import { useUserStore } from '@/stores/userStore'

createApp(App).use(pinia).use(router).use(vuetify).mount('#app')

// Automatically login lego man locally.  Saves devs clicks.
if (import.meta.env.MODE === 'development') {
  const userStore = useUserStore()
  userStore.handleLogin(true)
}
