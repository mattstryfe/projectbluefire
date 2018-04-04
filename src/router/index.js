import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'

// components

import Home from '@/components/Home'
import SWF from '@/components/SWF'

Vue.use(Router)
Vue.use(Vuetify)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/swf',
      name: 'SWF',
      component: SWF
    }

  ]
})
