// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { VPullToRefresh } from 'vuetify/labs/VPullToRefresh'
import { mercTheme } from '@/configs/mercTheme'

export const vuetify = createVuetify({
  directives,
  components: {
    ...components,
    VFileUpload,
    VPullToRefresh
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      // Scoped Merc theme — applied via <v-theme-provider theme="merc"> in the Merc shell.
      merc: mercTheme
    }
  },
  defaults: {
    global: {
      font: {
        family: '"Segoe UI", Roboto, sans-serif'
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})
