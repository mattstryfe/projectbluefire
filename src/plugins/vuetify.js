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
import { THEME_STORAGE_KEY, THEME_DARK, THEME_LIGHT, DEFAULT_DARK_MODE } from '@/configs/appDefaults'

/* Read the persisted dark-mode preference synchronously here — before Vuetify (and the app)
   first paints — so a returning user never sees a flash of the wrong theme (MER-25).
   useStorage in userStore keeps this key in sync; we read it raw to avoid a Pinia dependency
   during plugin construction. Defaults to dark to match the app's baseline. */
function resolveInitialTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  const isDarkMode = stored === null ? DEFAULT_DARK_MODE : stored === 'true'
  return isDarkMode ? THEME_DARK : THEME_LIGHT
}

export const vuetify = createVuetify({
  directives,
  components: {
    ...components,
    VFileUpload,
    VPullToRefresh
  },
  theme: {
    defaultTheme: resolveInitialTheme(),
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
