<template>
  <v-app-bar :elevation="2" rounded class="cust-o pr-2" density="compact">
    <template #prepend>
      <v-btn @click="router.push('/')" icon="mdi-fire" size="60" variant="plain" class="ml-n2">
        <v-icon
          size="50"
          class="mdi-rotate-315 burning-blue-fire-intense"
        ></v-icon>
      </v-btn>
      <h4 @click="router.push('/')" class="mb-n1 cursor-pointer">
        Project
        <span class="text-blue-lighten-1">Bluefire</span>
      </h4>
    </template>

    <template #append>
      <div v-if="mode">
        <v-icon
          v-for="i in headerIcons"
          :key="i.name"
          @click="router.push(i.path)"
          :name="i.name"
          class="pa-1 ma-1 v-icon--size-x-small"
          :color="i.color"
          :disabled="i.isDisabled"
        >
          {{ i.icon }}
        </v-icon>
      </div>

      <waffle-menu></waffle-menu>
      <main-user-account-menu></main-user-account-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import WaffleMenu from '@/components/navigation/MainWaffleMenu.vue'
import MainUserAccountMenu from '@/components/navigation/MainUserAccountMenu.vue'
import router from '@/plugins/router'
import { routerLinksSchema } from '@/plugins/router'
import { computed, ref } from 'vue'

const mode = ref(import.meta.env.MODE === 'development')
const headerIcons = computed(() => routerLinksSchema.filter(l => !l.hideInMainNav))
</script>

<style scoped>
:deep(.v-toolbar__content) {
  overflow: visible !important;
}

.burning-blue-fire-intense {
  animation: blueFireIntense 5s ease-in-out infinite;
}

@keyframes blueFireIntense {
  0% {
    color: #90caf9; /* Very light blue */
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.5));
    transform: scale(1);
  }
  50% {
    color: #2196f3; /* Medium blue */
    filter: drop-shadow(0 0 10px rgba(33, 150, 243, 0.8));
    transform: scale(1.1);
  }
  100% {
    color: #90caf9; /* Very light blue */
    filter: drop-shadow(0 0 2px rgba(144, 202, 249, 0.5));
    transform: scale(1);
  }
}
</style>
