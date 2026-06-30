<template>
  <!-- DEV-ONLY floating control (gated by import.meta.env.DEV at the call site in Merc.vue). Switches
       the signed-in Merc agent so the map's mine-vs-marketplace coloring and the "my showings" sheet
       can be tested without manual sign-in. Per-browser auth persistence means separate Chrome
       profiles / incognito windows can each hold a different agent for concurrent streaming tests.
       The avatar IS the FAB (fixed size — never collapses if the image is slow); the menu nests in it
       via activator="parent". -->
  <v-sheet color="transparent" class="merc-dev-fab d-flex align-center ga-2">
    <v-avatar
      size="48"
      color="surface"
      role="button"
      :aria-label="`Dev: logged in as ${currentLabel} — switch agent`"
      class="merc-dev-fab__avatar"
    >
      <!-- Explicit v-img (not the `image` prop): the nested v-menu lives in the default slot, and a
         provided default slot SUPPRESSES the `image` prop — so render the avatar image ourselves. -->
      <v-img :src="currentPhoto" :alt="currentLabel" cover />
      <v-menu activator="parent" location="bottom start">
        <v-list density="compact" min-width="220">
          <v-list-subheader>
            DEV · switch agent
          </v-list-subheader>
          <v-list-item
            v-for="a in agents"
            :key="a.email"
            @click="switchTo(a)"
            :active="a.email === currentEmail"
            :disabled="switching"
          >
            <template #prepend>
              <v-avatar size="32" :image="a.photoURL" :alt="a.displayName" />
            </template>
            <v-list-item-title>
              {{ a.displayName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ a.email }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-avatar>
    <span class="merc-dev-fab__name text-caption font-weight-medium">{{ currentLabel }}</span>
  </v-sheet>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMercAuthStore } from '@/stores/mercAuthStore'
import { useNotificationStore } from '@/stores/notificationStore.js'
import { MERC_DEV_AGENTS, devAgentPhotoURL } from '@/configs/mercDevAgents'

const mercAuthStore = useMercAuthStore()
const switching = ref(false)

const password = import.meta.env.VITE_MERC_DEV_PASSWORD
const agents = MERC_DEV_AGENTS.map((a) => ({ ...a, photoURL: devAgentPhotoURL(a.email) }))

const currentEmail = computed(() => mercAuthStore.getUserEmail)
const currentAgent = computed(() => agents.find((a) => a.email === currentEmail.value))
const currentPhoto = computed(() => currentAgent.value?.photoURL ?? devAgentPhotoURL(currentEmail.value ?? 'guest'))
const currentLabel = computed(() => currentAgent.value?.displayName ?? 'Dev agent')

async function switchTo(agent) {
  if (agent.email === currentEmail.value || switching.value) return
  const { addNotification } = useNotificationStore()
  switching.value = true
  const ok = await mercAuthStore.signInWithEmail(agent.email, password)
  switching.value = false
  if (ok) {
    // No reload: the map recolors via its uid watch and my-showings re-subscribes via the store's
    // auth watch — the switch is just a normal sign-in, handled like any other auth change.
    addNotification({
      message: `Now logged in as: ${agent.displayName}`,
      color: 'info',
      icon: 'mdi-account-switch',
      timeout: 2500
    })
  }
}
</script>

<style scoped>
/* Self-positioned top-left of the map stage (the stage is position:relative, so this anchors to it).
   DEV-only control; v-avatar's `size` fixes the hit area even if the image is slow/blocked. */
.merc-dev-fab {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.merc-dev-fab__avatar {
  cursor: pointer;
  /* Amber ring matches the user's own ("mine") pins on the map (#f59e0b) so the FAB reads as "you".
     Ring via box-shadow so it adds no layout/size. */
  box-shadow:
    0 0 0 3px #f59e0b,
    0 2px 8px rgba(0, 0, 0, 0.5);
}

.merc-dev-fab__name {
  /* Small, transparent-bg label confirming who's logged in (avatars are fake). Shadow keeps it
     legible over the map. */
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}
</style>
