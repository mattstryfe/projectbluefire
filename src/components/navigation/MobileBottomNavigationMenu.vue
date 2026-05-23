<template>
  <v-bottom-navigation
    v-if="!useLayoutStore().smAndUp"
    v-model="nav"
    app
    class="border-t-sm"
    color="primary"
    grow
    :height="isNative ? 108 : 65"
    horizontal
    v-scroll="onScroll"
    :style="{
      transform: isHidden ? 'translateY(100%)' : 'translateY(0)',
      opacity: isHidden ? 0 : 1
    }"
  >
    <div class="nav-buttons-row d-flex">
      <v-btn
        v-for="r in routesToUse"
        :key="r.name"
        @click="router.push({ name: r.name })"
        :disabled="r.disabled"
        :value="r.name"
      >
        <v-icon :color="r.iconClass ? undefined : r.color" size="30" :class="r.iconClass">
          {{ r.icon }}
        </v-icon>
        <span class="text-caption mt-1">{{ r.bottomNavName }}</span>
      </v-btn>
    </div>

    <div v-if="isNative" class="flex-grow-1 " />
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
:deep(.v-bottom-navigation__content) {
  flex-direction: column;
}

.nav-buttons-row {
  flex: 0 0 65px;
  width: 100%;
}

.nav-buttons-row :deep(.v-btn) {
  flex: 1 0 0;
  height: 100%;
}

.v-bottom-navigation {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  will-change: transform, opacity;
}

.burning-blue-fire-intense {
  animation: blueFireIntense 5s ease-in-out infinite;
}

@keyframes blueFireIntense {
  0% {
    color: #90caf9;
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.5));
    transform: scale(1) rotate(315deg);
  }
  50% {
    color: #2196f3;
    filter: drop-shadow(0 0 10px rgba(33, 150, 243, 0.8));
    transform: scale(1.1) rotate(315deg);
  }
  100% {
    color: #90caf9;
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.5));
    transform: scale(1) rotate(315deg);
  }
}
</style>
