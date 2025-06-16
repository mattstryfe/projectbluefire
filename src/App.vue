<template>
  <v-layout>
    <main-app-header></main-app-header>
    <v-main class="d-flex">
      <v-container fluid :class="{ 'px-1': smAndDown }" class="px-2">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import MainAppHeader from '@/components/navigation/MainAppHeader.vue'
// Vuetify Shorthand for responsiveness across app
// saves from needing to import and destructure in each component.
import { useDisplay } from 'vuetify'
import { provide } from 'vue'
// Destructure the specific breakpoint properties you want to provide
const { mdAndUp, smAndDown } = useDisplay()

// Provide these properties globally
provide('mdAndUp', mdAndUp)
provide('smAndDown', smAndDown)
</script>

<style>
/* MOBILE - prevents swiping down from refreshing the app*/
html,
body {
  overscroll-behavior: none;
}
.v-layout {
  min-height: 100vh;
  height: 100%;
}

.v-main {
  flex: 1 1 auto;
}
</style>
