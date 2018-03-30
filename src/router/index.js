import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'

// components

import Splash from '@/components/Splash'
import SWF from '@/components/SWF'

Vue.use(Router)
Vue.use(Vuetify)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Splash',
      component: Splash
    },
    {
      path: '/swf',
      name: 'SWF',
      component: SWF
    }

  ]
})
