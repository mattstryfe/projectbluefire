<template>
  <v-menu
    v-model="accountMenu"
    :close-on-content-click="false"
    location="bottom"
  >
    <template #activator="{ props }">
      <v-chip
        v-if="!userStore.userIsAuthenticated"
        @click="userStore.handleLogin()"
        variant="outlined"
        color="primary"
      >
        <v-icon start>mdi-account-outline</v-icon>
        Sign in
      </v-chip>
      <!-- v-bind props opens menu -->
      <v-avatar v-else v-bind="props" class="cursor-pointer">
        <v-img :src="`${userStore.getUserPhotoURL}`"></v-img>
      </v-avatar>
    </template>

    <v-card>
      <v-list>
        <v-list-item
          :prepend-avatar="`${userStore.getUserPhotoURL}`"
          :subtitle="userStore.getUserEmail"
          :title="userStore.getUserDisplayName"
        >
          <template #append>
            <v-btn
              @click="userStore.handleLogout()"
              size="small"
              variant="tonal"
              color="error"
              icon="mdi-logout"
              class="ml-2"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <user-account-menu-actions></user-account-menu-actions>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="accountMenu = false" variant="tonal">Cancel</v-btn>
        <v-btn @click="accountMenu = false" color="primary" variant="tonal">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import UserAccountMenuActions from '@/components/navigation/MainUserAccountMenuActions.vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { accountMenu } = storeToRefs(userStore)
</script>

<style scoped></style>
