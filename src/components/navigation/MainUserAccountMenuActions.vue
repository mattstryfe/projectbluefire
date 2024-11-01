<template>
  <v-list density="compact">
    <v-list-subheader color="secondary">User Controls</v-list-subheader>

    <v-list-item class="py-0 my-0">
      <template #prepend>
        <v-switch
          v-model="enableDarkMode"
          color="primary"
          hide-details
          class="mr-8"
          density="compact"
        ></v-switch>
      </template>

      <v-list-item-title class="text-capitalize v-label text-right">
        Dark Mode
      </v-list-item-title>
    </v-list-item>

    <v-list-item class="py-0 my-0">
      <template #prepend>
        <v-switch
          v-model="enableAutoSave"
          color="primary"
          hide-details
          class="mr-8"
          density="compact"
        ></v-switch>
      </template>

      <v-list-item-title class="text-capitalize v-label text-right">
        Auto Save
      </v-list-item-title>
    </v-list-item>

    <v-divider></v-divider>
    <v-list-subheader color="red-lighten-2">Danger Zone</v-list-subheader>
    <!-- example for now -->
    <v-progress-linear
      :active="!hasProfileBeenRepaired"
      :indeterminate="!hasProfileBeenRepaired"
      color="green-darken-3"
    ></v-progress-linear>

    <v-list-item
      v-for="(item, i) in dangerZoneEntries"
      :key="i"
      @click="item.action"
      :value="item"
    >
      <template #prepend>
        <v-icon
          :icon="item.icon"
          :color="item.iconColor"
          :loading="true"
        ></v-icon>
      </template>
      <v-list-item-title class="text-capitalize v-label">{{
        item.name
      }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { ref } from 'vue'
const enableDarkMode = ref(false)
const enableAutoSave = ref(true)
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { hasProfileBeenRepaired } = storeToRefs(userStore)

const userControls = ref([
  { name: 'dark mode', icon: '' },
  { name: 'auto save', icon: '' }
])
const dangerZoneEntries = ref([
  {
    name: 'repair profile',
    icon: 'mdi-wrench',
    iconColor: 'warning',
    loadingIcon: '',
    action: userStore.repairUserAccount,
    appendStatus: hasProfileBeenRepaired
  },
  {
    name: 'nuke profile',
    icon: 'mdi-nuke',
    iconColor: 'red-darken-2 ',
    action: userStore.nukeUserAccount,
    appendStatus: false
  }
])
</script>

<style scoped></style>
