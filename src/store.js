import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawerToggle: true,
    testValue: 'test value',
    pages: {
      Home: {
        icon: 'fa-home',
        title: 'Home',
        href: '/',
        color: 'blue darken-2',
        desc: 'Simple Weather Forecast (SWF). A simple daily forecast.'
      },
      swf: {
        icon: 'fa-cloud-sun',
        title: 'SWF',
        href: '/swf',
        color: 'blue darken-2',
        desc: 'Simple Weather Forecast (SWF). A simple daily forecast.'
      },
      projects: {
        icon: 'fa-tools',
        title: 'Projects',
        href: '/projects',
        color: 'orange darken-2',
        desc: 'Small group of side projects including, peltiers, DHT Sensors, and ESP8266 modules.'
      },
      blog: {
        icon: 'fa-comment-dots',
        title: 'Blog',
        href: '/blog',
        color: 'green darken-2',
        desc: 'Capturing the new build, day-by-day. Also some ideas and current events.'
      }
    }
  },
  mutations: {
    changeDrawerToggle(state, value) {
      state.drawerToggle = value
    }
  },
  actions: { }
})
