import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    positions: [
      {
        year: 2020,
        company: 'MAXAR',
        text_color: 'yellow--text',
        title: 'Front End Developer',
        tech: ['Vue.js', 'VUEX', 'Vuetify'],
        highlight: 'Led & executed ground up development of Vue.js App.',
        details: 'Cultivated and deployed stakeholder vision from concept to reality < 8 months during pandemic.'
      },
      {
        year: 2019,
        company: 'MAXAR',
        text_color: 'yellow--text',
        title: 'Front End Developer',
        tech: ['Vue.js', 'Bootstrap', 'AngularJS'],
        highlight: 'Executed rebuild of AngularJS App.',
        details: 'Built and deployed Vue.js & Micronaut App.' +
          ' Constructed from the ground up. ' +
          'First of its kind and virtually no templates, guides, or pre configuration files.'
      },
      {
        year: 2018,
        company: 'Invictus',
        icon: '@/assets/images/portfolio/invictus-logo.png',
        text_color: 'blue-grey--text text--lighten-5',
        title: 'Front End Developer',
        tech: ['Vue.js', 'Leaflet', 'Turf.js', 'AngularJS'],
        highlight: ' Stand-in Lead for multiple sprint cycles.',
        details: 'Built and integrated Leaflet powered interactive map component.' +
          'Introduced real-time geospatial storm tracking and personnel checks within alert areas.'
      },
      {
        year: 2017,
        company: 'Invictus',
        title: 'Front End Developer',
        tech: ['AngularJS'],
        highlight: 'Implemented full-state support across application.',
        details: 'Built & Integrated user history, word cloud, summary window, and text comparison tool'
      },
      {
        year: 2016,
        company: 'U.S.A.F',
        title: 'Front End Developer',
        tech: ['AngularJS'],
        highlight: 'Implemented full-state support across application.',
        details: 'Built & Integrated user history, word cloud, summary window, and text comparison tool'
      },
    ],
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
