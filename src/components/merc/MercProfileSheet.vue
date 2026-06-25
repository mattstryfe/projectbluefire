<template>
  <v-card class="merc-sheet" rounded="t-xl">
    <v-sheet color="surface-variant" rounded="pill" width="40" height="4" class="mx-auto mt-2 mb-1" />

    <v-card-title class="d-flex align-center">
      Me
      <v-spacer />
      <v-btn @click="emit('close')" icon="mdi-close" variant="text" size="small" />
    </v-card-title>

    <v-card-text>
      <v-row no-gutters align="center" class="mb-3">
        <v-col cols="auto" class="mr-3">
          <v-avatar size="56" color="surface-variant">
            <v-img v-if="photoURL" :src="photoURL" />
            <v-icon v-else size="32" color="medium-emphasis">
              mdi-account
            </v-icon>
          </v-avatar>
        </v-col>
        <v-col>
          <span class="d-block text-subtitle-1 font-weight-bold">{{ displayName }}</span>
          <span class="d-block text-caption text-medium-emphasis">{{ email }}</span>
          <v-chip size="x-small" color="warning" variant="tonal" class="mt-1">
            Unverified
          </v-chip>
        </v-col>
      </v-row>

      <v-list class="px-0">
        <v-list-item prepend-icon="mdi-office-building-outline" title="Brokerage" subtitle="Pearson Realty" />
        <v-list-item prepend-icon="mdi-bell-outline" title="Notifications" />
        <v-list-item prepend-icon="mdi-theme-light-dark" title="Appearance" subtitle="Dark mode toggle — MER-25" />
        <v-list-item prepend-icon="mdi-help-circle-outline" title="Help & feedback" />
      </v-list>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn
        v-if="mercAuthStore.userIsAuthenticated"
        @click="signOut"
        color="error"
        variant="tonal"
        block
        prepend-icon="mdi-logout"
      >
        Sign out of Merc
      </v-btn>
      <span v-else class="text-caption text-disabled mx-auto">Not signed in to Merc</span>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useMercAuthStore } from '@/stores/mercAuthStore'

const emit = defineEmits(['close'])
const mercAuthStore = useMercAuthStore()

const displayName = computed(() => mercAuthStore.getUserDisplayName || 'Merc agent')
const email = computed(() => mercAuthStore.getUserEmail || 'Not signed in')
const photoURL = computed(() => mercAuthStore.userInfo.photoURL)

async function signOut() {
  await mercAuthStore.signOutMerc()
  emit('close')
}
</script>
