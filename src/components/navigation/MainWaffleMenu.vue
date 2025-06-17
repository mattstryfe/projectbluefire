<template>
  <v-menu v-model="waffleMenu" location="bottom" width="400">
    <template #activator="{ props }">
      <v-btn
        icon="mdi-dots-grid"
        v-bind="props"
        class="cursor-pointer mr-1"
        color="green-darken-3"
      ></v-btn>
    </template>

    <v-card>
      <v-container fluid>
        <v-row dense no-gutters>
          <v-col v-if="!userIsAuthenticated" cols="12">
            <v-alert type="info" variant="outlined">
              Must login to access cool shit...
            </v-alert>
          </v-col>

          <v-card
            v-for="entry in waffleEntries"
            :key="entry.name"
            class="cursor-pointer text-center v-col-4 pa-1"
            variant="flat"
            :disabled="isCardDisabled(entry)"
            v-tooltip="{
              text: entry.details,
              location: 'bottom'
            }"
          >
            <v-hover>
              <template #default="{ isHovering, props }">
                <v-card
                  @click="navigate(entry)"
                  :variant="isHovering ? 'tonal' : 'flat'"
                  v-bind="props"
                  class="pa-2"
                  link
                >
                  <v-icon
                    size="2em"
                    :color="isHovering ? 'success' : entry.color"
                    :class="entry.class"
                  >
                    {{ entry.icon }}
                  </v-icon>
                  <v-card-subtitle>{{ entry.name }}</v-card-subtitle>
                </v-card>
              </template>
            </v-hover>
          </v-card>
        </v-row>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { routes } from '@/schemas/routerLinksSchema'
import { useNavigation } from '@/composables/useNavigation'

const { navigate } = useNavigation()

const userStore = useUserStore()
const { userIsAuthenticated } = storeToRefs(userStore)
// slice off home page
const waffleEntries = computed(() => routes.filter((l) => !l.hideInMainNav))
// consolidate card isDisabled checks
const isCardDisabled = (entry) =>
  !userIsAuthenticated || !entry.path || entry.isDisabled

const waffleMenu = ref()
</script>

<style scoped></style>
