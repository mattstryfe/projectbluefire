import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

Vue.use(Vuetify)

export default new Vuetify({
  // theme: { dark: true },
  theme: {
    // dark: true,
    themes: {
      dark: {
        primary: '#000000',
        secondary: '#000000',
        accent:'#000000'
      }
    }
  },
  icons: { iconfont: 'fa'},
})



// this works
// export default new Vuetify({
//   theme: { dark: true },
//   icons: { iconfont: 'fa'},
// })
//
