import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawerToggle: true,
    pages: [
      {
        name: 'swf',
        icon: 'fa-cloud-sun',
        title: 'SWF',
        href: '/swf',
        color: 'blue darken-2',
        desc: 'Simple Weather Forecast (SWF). A simple daily forecast.'
      },
      {
        name: 'blog',
        icon: 'fa-comment-dots',
        title: 'Blog',
        href: '/blog',
        color: 'green darken-2',
        desc: 'Capturing the new build, day-by-day. Also some ideas and current events.'
      },
      {
        name: 'portfolio',
        icon: 'fa-scroll',
        title: 'Portfolio',
        href: '/portfolio',
        color: 'yellow darken-2',
        desc: `Me, myself, and I.  Plus some of what I've done.`
      }
    ]
  },
  mutations: {
    changeDrawerToggle(state, value) {
      state.drawerToggle = value
    }
  },
  actions: { }
})
