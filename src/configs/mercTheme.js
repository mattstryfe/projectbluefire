// Merc's scoped Vuetify theme (MER-9). Registered as a named theme in plugins/vuetify.js and
// applied at the Merc shell boundary via <v-theme-provider theme="merc">, so it sets Merc's
// visual baseline without touching BlueFire's global theme.
//
// Dark-only for now (per the latest direction). A real light/dark toggle is MER-25; making
// Merc respect that global choice is a later follow-up.

export const mercTheme = {
  dark: true,
  colors: {
    background: '#0d0f12',
    surface: '#16191f',
    'surface-variant': '#252a33',
    'on-surface-variant': '#c7ccd6',
    primary: '#14b8a6', // teal — Merc brand accent
    secondary: '#3b82f6', // blue — bid pins / primary action FAB
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  }
}
