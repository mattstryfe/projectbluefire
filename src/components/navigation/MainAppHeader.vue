<template>
  <v-app-bar :elevation="2" rounded title="Project Bluefire" class="cust-o" density="compact">
    <template #prepend>
      <v-btn
        @click="$router.push('/')"
        icon="mdi-atom-variant"
        color="primary"
        class="mr-2 hover-spin-continuous"
      ></v-btn>
      <v-divider vertical></v-divider>
    </template>

    <template #append>
      <div v-if="mode">
        <v-icon
          v-for="w in routerLinksSchema"
          :key="w.name"
          @click="router.push(w.path)"
          :name="w.name"
          class="pa-1 ma-1 v-icon--size-x-small"
          :color="w.color"
          :disabled="w.isDisabled"
        >
          {{ w.icon }}
        </v-icon>
      </div>

      <waffle-menu></waffle-menu>
      <user-account-menu></user-account-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
// TODO: Used w in routerLinksSchema to follow same pattern in MainWaffleMenu -> Easier refactor.
import WaffleMenu from '@/components/navigation/MainWaffleMenu.vue'
import UserAccountMenu from '@/components/navigation/MainUserAccountMenu.vue'
import routerLinksSchema from '@/schemas/routerLinksSchema'
import router from '@/plugins/router'
import { ref } from 'vue'
const mode = ref(import.meta.env.MODE === 'development')
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.hover-spin-continuous {
  animation: spin 5s linear infinite;
}
.cust-o {
  overflow: visible !important;
}
</style>
