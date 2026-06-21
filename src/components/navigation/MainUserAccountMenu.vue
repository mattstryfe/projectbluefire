<template>
  <!-- Signed out of everything: the account button opens the sign-in modal -->
  <v-btn
    v-if="!anySignedIn"
    @click="signInModalOpen = true"
    icon
    variant="text"
    color="primary"
  >
    <v-icon size="30">
      mdi-account-circle-outline
    </v-icon>
  </v-btn>

  <!-- Signed into at least one app: the avatar opens the account dropdown -->
  <v-menu v-else v-model="accountMenu" :close-on-content-click="false" location="bottom">
    <template #activator="{ props }">
      <v-avatar v-bind="props" class="cursor-pointer">
        <v-img :src="avatarUrl"></v-img>
      </v-avatar>
    </template>

    <v-card>
      <v-list>
        <!-- BlueFire: status + its own logout -->
        <v-list-item
          v-if="userStore.userIsAuthenticated"
          :prepend-avatar="userStore.getUserPhotoURL"
          :subtitle="userStore.getUserEmail"
          :title="userStore.getUserDisplayName"
        >
          <template #append>
            <v-chip size="x-small" color="info" variant="tonal" class="mr-2">
              BlueFire
            </v-chip>
            <v-btn
              @click.stop="userStore.handleLogout()"
              size="small"
              variant="tonal"
              color="error"
              icon="mdi-logout"
            ></v-btn>
          </template>
        </v-list-item>
        <v-list-item
          v-else
          @click="openSignInModal"
          prepend-icon="mdi-fire"
          title="Sign in to BlueFire"
        ></v-list-item>

        <!-- Merc: status + its own logout -->
        <v-list-item
          v-if="mercAuthStore.userIsAuthenticated"
          :subtitle="mercAuthStore.getUserEmail"
          :title="mercAuthStore.getUserDisplayName || 'Merc agent'"
          prepend-icon="mdi-map-marker-radius"
        >
          <template #append>
            <v-chip size="x-small" color="teal" variant="tonal" class="mr-2">
              Merc
            </v-chip>
            <v-btn
              @click.stop="mercAuthStore.signOutMerc()"
              size="small"
              variant="tonal"
              color="error"
              icon="mdi-logout"
            ></v-btn>
          </template>
        </v-list-item>
        <v-list-item
          v-else
          @click="openSignInModal"
          prepend-icon="mdi-map-marker-radius"
          title="Sign in to Merc"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <user-account-menu-actions></user-account-menu-actions>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="accountMenu = false" variant="tonal">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>

  <main-sign-in-modal v-model="signInModalOpen"></main-sign-in-modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import UserAccountMenuActions from '@/components/navigation/MainUserAccountMenuActions.vue'
import MainSignInModal from '@/components/navigation/MainSignInModal.vue'
import { useUserStore } from '@/stores/userStore'
import { useMercAuthStore } from '@/stores/mercAuthStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const mercAuthStore = useMercAuthStore()
const { accountMenu } = storeToRefs(userStore)

const signInModalOpen = ref(false)

const anySignedIn = computed(
  () => userStore.userIsAuthenticated || mercAuthStore.userIsAuthenticated
)

// Prefer BlueFire's photo, fall back to Merc's, then a default avatar.
const avatarUrl = computed(
  () =>
    (userStore.userIsAuthenticated && userStore.getUserPhotoURL) ||
    mercAuthStore.userInfo.photoURL ||
    'https://randomuser.me/api/portraits/lego/1.jpg'
)

function openSignInModal() {
  accountMenu.value = false
  signInModalOpen.value = true
}
</script>

<style scoped></style>
