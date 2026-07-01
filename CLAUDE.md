# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

"For Merc module work, also read MERC.md."
## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **UI Framework**: Vuetify 4
- **State Management**: Pinia stores
- **Routing**: Vue Router 4
- **Backend Services**: Firebase (Auth, Firestore)
- **CMS**: Sanity.io for blog content
- **Mobile**: Capacitor for Android app builds

## Project Architecture

### Core Structure

- **src/pages/**: Main application pages (LandingPage, Blog, weather forecasts)
- **src/components/**: Reusable Vue components organized by feature
- **src/stores/**: Pinia stores for state management (user, layout, sanity blog)
- **src/plugins/**: Third-party integrations (Firebase, Sanity, Vuetify, Router)
- **src/schemas/**: Route definitions and data schemas
- **src/utils/**: Weather data calculation and chart configuration utilities
- **src/mocks/**: Mock NWS response data for development/testing (controlled via `VITE_MOCK_WEATHER_DELAY_MS`)
- **archive/**: Legacy app — **never modify or reference** unless explicitly asked (see Archive note below)

### State Management Pattern

Uses Pinia with dedicated stores:

- `userStore`: Authentication, user profile, navigation drawer, geolocation
- `layoutStore`: Vuetify responsive breakpoint wrapper (smAndUp, mdAndUp)
- `weatherDataStore`: NWS forecast data, loading state, zipcode/coords management
- `notificationStore`: App-wide toast/snackbar queue
- `sanityBlogStore`: Blog content from Sanity CMS

### Routing System

Routes are centrally defined in `src/schemas/routerLinksSchema.js` with metadata for:

- Navigation visibility (`hideInMainNav`, `showInMobileNav`)
- Icons, colors, and styling
- Archive status for legacy features
- Mobile-specific names (`bottomNavName`)

### Authentication Flow

- Development: Auto-login with test account (see main.js:12-15)
- Production: Google OAuth and email/password via Firebase Auth
- User data stored in Firestore with profile preferences

### Mobile Integration

- Capacitor configs for dev/prod environments
- Android build configurations in `android/` directory
- Live reload setup for development (requires network configuration)

## Key Configuration Files

- `capacitor.config.json`: Default mobile config
- `capacitor.config.dev.json`: Development with live reload
- `capacitor.config.prod.json`: Production mobile build
- `scripts/switch-capacitor-config.js`: Environment switching utility
- `src/configs/appDefaults.js`: Shared constants (timeouts, thresholds, chart modes) — all new magic numbers belong here

## Development Notes

- Vite dev server runs on port 8080 with host 0.0.0.0 for mobile development
- Test user auto-login enabled in development mode
- Archive directory contains legacy features accessible via subdomain
- Uses @ alias for src/ directory imports
- SVG loader plugin enabled for icon imports

## Notification System
App-wide toasts are managed via `notificationStore`. Use `addNotification({ message, color, icon, timeout })` from any store or component. `timeout: null` keeps the toast pinned until manually dismissed with `removeNotification(id)`. In dev/beta, err on the side of notifying for most user-facing events.

## Archive
The `archive/` directory is a legacy app preserved for historical reference and is pseudo-deployed as the `.archive` subdomain. **Never modify or reference archive files** unless explicitly asked — its patterns are not representative of current conventions.

## Code Style Guidelines

- Always formulate and communicate a clear plan prior to making ANY code changes.
- If you are not 100% sure on the task being asked, prompt with clarifying questions or concerns before moving forward.
- Ask clarifying questions one at a time — the answer to the first may resolve or change subsequent questions.
- Use `// TODO: TG-xx: <note>` to tag problem lines during triage. These show yellow in the IDE and are greppable by the /triage skill. Drop them before making changes — they survive deferral.
- **NEVER add arbitrary divs or DOM elements** - use semantic HTML and Vuetify components
- **Use Vuetify's built-in layouts** (v-container, v-row, v-col) instead of custom div structures
- Avoid "div-itis" - prefer Vuetify components with built-in layout classes
- Use Vuetify's spacing, typography, and theme system instead of custom CSS
- When making changes, ask/prompt me with questions if you're not sure what im asking or think of something I could have missed.
- At the end of every ticket, proactively draft a succinct commit message — 3–4 short sentences max, prefixed with the ticket ref (`tg-xx:` / `MER-x:`) — for me to review. (Still no commit until I say go.)
- Update your local memory file with anything you've learned this session about working with me to remove future friction

## Code Conventions (canonical patterns)

The codebase is ~95% consistent on these — new/edited files must follow them; a mismatch is a bug, not a style preference. (Codified in the MER-51 audit; ESLint enforcement of the automatable subset is planned in MER-53.)

### Vue SFCs
- `<script setup>` only (no Options API). Internal section order, top → bottom:
  1. imports (vue core → pinia/composables → local components → stores → workers → utils → configs → external libs)
  2. `defineProps` / `defineEmits`
  3. store instantiation + `storeToRefs` (grouped together)
  4. composable instantiation
  5. reactive state (`ref` / `reactive` / template refs)
  6. `computed`
  7. watchers (`watch` / `watchEffect`)
  8. functions / event handlers
  9. lifecycle hooks (`onMounted` / `onUnmounted` / …) + `defineExpose` last
- `<template>` first in the file, `<style scoped>` last.
- Comments explain WHY, not WHAT — no `// --- State ---` section-header comments.

### Naming
- Booleans: `is*` / `has*` / `can*` / `show*`.
- Event handlers: `handle*` (never the `on*` prefix).
- Template/DOM refs: `*Ref` suffix.
- Pinia store instances: `<name>Store` (drop the `use` prefix on the variable); never abbreviate.
- Store computed getters keep the established `get*` prefix (e.g. `getUserUid`, `getUserEmail`) — match it across stores; do NOT "fix" one store to drop it.
- Prefer domain names over generic `data` / `temp` / `val` / `x` / `item`.

### Store ↔ worker layering (critical)
- Stores (`src/stores/*Store.js`) hold ONLY vue-y reactive state.
- Business logic, Firestore queries, and I/O live in plain worker modules (`src/workers/*.js`).
- A worker NEVER imports a store — the store injects what the worker needs as params.
- Cross-component actions/state go through a store; use `emit` only for simple local events (e.g. `close`).
- Normalize external data shapes at the worker boundary (e.g. Firestore `Timestamp` → JS `Date`) so components stay presentational.

### Misc
- New magic numbers/constants belong in a defaults/config module (`src/configs/appDefaults.js`, `src/configs/mercDefaults.js`), never inline.
- `@` is the alias for `src/`.
