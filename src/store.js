import Vue from 'vue'
import Vuex from 'vuex'
import { getAppointmentsFromDb, getClaimedAppointments } from '@/services/MercServices'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    isUserAuthenticated: state => state.isUserAuthenticated,
    authenticatedUser: state =>  state.authenticatedUser
  },
  state: {
    recentLocationToUse: null,
    selectedBoosts: [],
    boostFilters: [],
    appointments: [],
    claimedAppointments: [],
    isUserAuthenticated: false,
    attemptingToAuthenticate: false,
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
        desc: 'Simple Weather Forecast',
        chips: ['In development', 'Updated']
      },
      {
        name: 'dwf',
        icon: 'fa-cloud-meatball',
        title: 'DWF',
        href: '/dwf',
        color: 'orange darken-2',
        desc: 'Detailed Weather Forecast',
        chips: ['In development', 'New']
      },
      {
        name: 'blog',
        icon: 'fa-newspaper',
        title: 'Blog',
        href: '/blog',
        color: 'green darken-2',
        desc: 'Capturing the new build, day-by-day. Also some ideas and current events.',
      },
      {
        name: 'portfolio',
        icon: 'fa-scroll',
        title: 'Portfolio',
        href: '/portfolio',
        color: 'yellow darken-2',
        desc: `Me, myself, and I.  Plus some of what I've done.`,
      },
      {
        name: 'merc',
        icon: 'fa-globe-americas',
        title: 'Merc',
        href: '/merc',
        color: 'teal lighten-1',
        desc: 'Mock merc tracker. (Artisan/Operatives)',
        chips: ['In development', 'New', 'Requires Auth']
      },
      {
        name: 'nhl21',
        icon: 'fa-hockey-puck',
        title: 'NHL 21',
        href: '/nhl21',
        color: 'red lighten-1',
        desc: 'Player creation tool',
        chips: ['Archived']
      },
      {
        name: 'Fantasy',
        icon: 'fab fa-foursquare',
        title: 'Fantasy',
        href: '/fantasy',
        color: 'blue darken-4',
        desc: 'Fantasy manager tool',
        chips: ['In development', 'New', 'Requires Auth']
      }
    ]
  },
  mutations: {
    // DWF MUTATIONS
    updateRecentLocation(state, value) {
      state.recentLocationToUse = value
    },
    // NHL21 MUTATIONS
    updateSelectedBoosts(state, value) {
      state.selectedBoosts = value
    },
    updateBoostFilters(state, value) {
      state.boostFilters = value
    },
    // MERC MUTATIONS
    refreshAppointments(state, value) {
      state.appointments = value
    },
    refreshClaimedAppointments(state, value) {
      if (!state.isUserAuthenticated)
        value = []

      state.claimedAppointments = value
    },
    updateUserLoc(state, value) {
      state.userLoc = value
    },
    authenticateUser(state, value) {
      state.authenticatedUser = {
        avatar: value.getImageUrl(),
        email: value.getEmail(),
        id: value.getId(),
        name: value.getName()
      }
    },
    clearUserProfile(state) {
      state.authenticatedUser = {
        avatar: null,
        email: null,
        id: null,
        name: null
      }
    },
    isUserAuthenticated(state, value) {
      state.isUserAuthenticated = value
    }
  },
  actions: {
    async refreshAppointments({ commit, state }) {
      commit('refreshAppointments', await getAppointmentsFromDb())
    },
    async refreshClaimedAppointments({ commit, state }) {
      commit('refreshClaimedAppointments', await getClaimedAppointments(state.authenticatedUser.id))
    },
    async userLogin({ commit, dispatch, state }) {
      try {
        // for loading bar
        state.attemptingToAuthenticate = true

        const prof = await Vue.gAuth.signIn()

        const user = prof.getBasicProfile()

        // Launch auth
        commit('authenticateUser', user)

        // toggle true
        commit('isUserAuthenticated', true)

        // get claimed appts
        dispatch('refreshClaimedAppointments')
      } catch (e) {
        dispatch('userLogout')
      }

      // after everything
      state.attemptingToAuthenticate = false

    },
    async userLogout({ commit, dispatch, state }) {
      await Vue.gAuth.signOut()

      // clear user profile
      commit('clearUserProfile')

      // toggle false
      commit('isUserAuthenticated', false)

      // get claimed appts
      dispatch('refreshClaimedAppointments')
    }
  }
})
