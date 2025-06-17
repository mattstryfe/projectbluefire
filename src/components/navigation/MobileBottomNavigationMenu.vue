<template>
  <v-bottom-navigation
    v-if="!useLayoutStore().smAndUp"
    app
    v-model="nav"
    class="border-t-sm"
    :class="{ 'app-bottom-navigation-shim': isNative }"
    color="primary"
    grow
    :height="isNative ? 98 : 55"
    horizontal
    v-scroll="onScroll"
    :style="{
      transform: isHidden ? 'translateY(100%)' : 'translateY(0)',
      opacity: isHidden ? 0 : 1 // Correctly fade in/out
    }"
  >
    <!-- Bottom Navigation Pages.  Filtered by enabled for now-->
    <v-btn
      v-for="r in routesToUse"
      :key="r.name"
      @click="router.push({ name: r.name })"
      :disabled="r.disabled"
      :value="r.name"
    >
      <v-icon :color="r.color">
        {{ r.icon }}
      </v-icon>
      <span class="text-caption">{{ r.bottomNavName }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { routes } from '@/schemas/routerLinksSchema'
import router from '@/plugins/router'
import { computed, ref, watch } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore.js'
import { useRoute } from 'vue-router'
import { Capacitor } from '@capacitor/core'

// app/platform dictator
const isNative = ref(Capacitor.isNativePlatform())
console.log('isNative', isNative)

const route = useRoute()
const nav = ref({})

watch(
  () => route.name,
  (newRoute) => {
    nav.value = newRoute
  }
)
const routesToUse = computed(() => routes.filter((r) => r.showInMobileNav))

const lastScrollY = ref(0) // Tracks last scroll position

// Mimic `v-app-bar` scroll behavior
const onScroll = () => {
  const currentScrollY = window.scrollY
  isHidden.value = currentScrollY > lastScrollY.value && currentScrollY > 50
  lastScrollY.value = currentScrollY
}

const isHidden = ref(false) // Controls hiding behavior
</script>

<style scoped>
.app-bottom-navigation-shim {
  padding-bottom: 35px !important;
}
/* Smooth transition */
.v-bottom-navigation {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  will-change: transform, opacity; /* Boost performance */
}
</style>
