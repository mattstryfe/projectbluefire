import Vue from 'vue'
import Vuex from 'vuex'
import { getAppointmentsFromDb, getClaimedAppointments } from '@/services/MercServices'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appointments: '',
    claimedAppointments: '',
    isUserAuthenticated: false,
    authenticatedUser: {
      avatar: null,
      name: null,
      email: null,
      id: null
    },
    userLoc: '',
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
        icon: 'fa-newspaper',
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
      },
      {
        name: 'merc',
        icon: 'fa-globe-americas',
        title: 'Merc',
        href: '/merc',
        color: 'teal lighten-1',
        desc: 'Mock merc tracker. (Artisan/Operatives)'
      }
    ]
  },
  mutations: {
    // MERC MUTATIONS
    async refreshAppointments(state, value) {

      state.appointments = await getAppointmentsFromDb()
    },
    async refreshClaimedAppointments(state, value) {
      if (!state.isUserAuthenticated)
        return

      // refresh appointments
      state.claimedAppointments = await getClaimedAppointments(state.authenticatedUser.id)
    },
    changeDrawerToggle(state, value) {
      state.drawerToggle = value
    },
    updateUserLoc(state, value) {
      state.userLoc = value
    },
    async updateAuthenticatedUser(state, value) {
      state.authenticatedUser = value

      // refresh appointments
      state.claimedAppointments = await getClaimedAppointments(state.authenticatedUser.id)
    },
    async isUserAuthenticated(state, value) {
      state.isUserAuthenticated = value

      if (value)
        // refresh appointments
        state.claimedAppointments = await getClaimedAppointments(state.authenticatedUser.id)
      else
        state.claimedAppointments = ''
    }
  },
  actions: { }
})
