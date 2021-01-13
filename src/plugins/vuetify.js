import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import { VTextField } from 'vuetify/lib'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

// Vue.use(Vuetify)
Vue.use(Vuetify, {
  components: {
    VTextField
  }
})
//
// // Google Location AutoComplete
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: process.env.VUE_APP_GOOG_CLIENT_KEY, // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
  version: '...', // Optional
  language: '...', // Optional
})


export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#303030'
      }
    }
  },
  icons: { iconfont: 'fa'},
  breakpoint: {
    mobileBreakpoint: 'sm' // This is equivalent to a value of 340
  },
})

