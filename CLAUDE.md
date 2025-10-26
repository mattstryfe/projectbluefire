# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **UI Framework**: Vuetify 3
- **State Management**: Pinia stores
- **Routing**: Vue Router 4
- **Backend Services**: Firebase (Auth, Firestore)
- **CMS**: Sanity.io for blog content
- **Mobile**: Capacitor for Android app builds

## Common Development Commands

### Web Development

```bash
npm run dev                 # Start development server on port 8080
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting
```

### Mobile Development (Android)

```bash
npm run dev:mobile         # Development with live reload (requires IP config)
npm run build:mobile       # Production build for mobile
npm run sync:android       # Sync web assets to Android project
```

### Blog/CMS (Sanity)

Navigate to `src/sanity/` directory and run:

```bash
npm run dev                # Start Sanity Studio
npx sanity docs           # Open documentation
npx sanity manage         # Open project settings
```

## Project Architecture

### Core Structure

- **src/pages/**: Main application pages (LandingPage, Blog, weather forecasts)
- **src/components/**: Reusable Vue components organized by feature
- **src/stores/**: Pinia stores for state management (user, layout, sanity blog)
- **src/plugins/**: Third-party integrations (Firebase, Sanity, Vuetify, Router)
- **src/schemas/**: Route definitions and data schemas
- **archive/**: Legacy code preserved for reference

### State Management Pattern

Uses Pinia with dedicated stores:

- `userStore`: Authentication, user profile, navigation drawer state
- `layoutStore`: UI layout preferences
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

## Development Notes

- Vite dev server runs on port 8080 with host 0.0.0.0 for mobile development
- Test user auto-login enabled in development mode
- Archive directory contains legacy features accessible via subdomain
- Uses @ alias for src/ directory imports
- SVG loader plugin enabled for icon imports

## Code Style Guidelines

- **NEVER add arbitrary divs or DOM elements** - use semantic HTML and Vuetify components
- **Use Vuetify's built-in layouts** (v-container, v-row, v-col) instead of custom div structures
- Avoid "div-itis" - prefer Vuetify components with built-in layout classes
- Use Vuetify's spacing, typography, and theme system instead of custom CSS
