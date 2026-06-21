<template>
  <v-dialog v-model="open" max-width="460" :fullscreen="smAndDown">
    <v-card class="pa-4">
      <v-card-title class="text-center">
        Sign in
      </v-card-title>

      <!-- Fork in the road: choose which app to sign into -->
      <v-row align="center" justify="center" class="my-2">
        <v-col cols="auto" class="text-center">
          <v-btn
            @click="selected = 'bluefire'"
            :variant="selected === 'bluefire' ? 'tonal' : 'text'"
            color="info"
            icon
            size="x-large"
          >
            <v-icon size="36">
              mdi-fire
            </v-icon>
          </v-btn>
          <div class="text-caption mt-1">
            BlueFire
          </div>
        </v-col>

        <v-col cols="auto">
          <v-icon size="32" color="medium-emphasis">
            mdi-arrow-left-right
          </v-icon>
        </v-col>

        <v-col cols="auto" class="text-center">
          <v-btn
            @click="selected = 'merc'"
            :variant="selected === 'merc' ? 'tonal' : 'text'"
            color="teal"
            icon
            size="x-large"
          >
            <v-icon size="36">
              mdi-map-marker-radius
            </v-icon>
          </v-btn>
          <div class="text-caption mt-1">
            Merc
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-3"></v-divider>

      <!-- BlueFire: Google only -->
      <v-btn
        v-if="selected === 'bluefire'"
        @click="signInBlueFire"
        block
        color="info"
        prepend-icon="mdi-google"
        :loading="busy"
      >
        Sign in to BlueFire with Google
      </v-btn>

      <!-- Merc: Google + email/password -->
      <template v-else-if="selected === 'merc'">
        <v-btn
          @click="signInMercGoogle"
          block
          color="teal-darken-1"
          prepend-icon="mdi-google"
          :loading="busy"
          class="mb-4"
        >
          Continue with Google
        </v-btn>

        <v-form @submit.prevent="submitMercEmail">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            prepend-inner-icon="mdi-email-outline"
            density="comfortable"
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
            prepend-inner-icon="mdi-lock-outline"
            density="comfortable"
          />
          <v-btn type="submit" block variant="tonal" color="teal-darken-1" :loading="busy">
            {{ isRegister ? 'Register' : 'Sign in with email' }}
          </v-btn>
        </v-form>

        <v-btn @click="isRegister = !isRegister" variant="text" block size="small" class="mt-2">
          {{ isRegister ? 'Have an account? Sign in' : 'Need an account? Register' }}
        </v-btn>
      </template>

      <!-- Nothing chosen yet -->
      <div v-else class="text-center text-medium-emphasis py-4">
        Choose an account above to sign in.
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="open = false" variant="text">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useUserStore } from '@/stores/userStore'
import { useMercAuthStore } from '@/stores/mercAuthStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const { smAndDown } = useDisplay()
const userStore = useUserStore()
const mercAuthStore = useMercAuthStore()

const selected = ref(null)
const email = ref('')
const password = ref('')
const isRegister = ref(false)
const busy = ref(false)

async function signInBlueFire() {
  busy.value = true
  await userStore.handleLogin()
  busy.value = false
  if (userStore.userIsAuthenticated) open.value = false
}

async function signInMercGoogle() {
  busy.value = true
  const ok = await mercAuthStore.signInWithGoogle()
  busy.value = false
  if (ok) open.value = false
}

async function submitMercEmail() {
  busy.value = true
  const ok = isRegister.value
    ? await mercAuthStore.registerWithEmail(email.value, password.value)
    : await mercAuthStore.signInWithEmail(email.value, password.value)
  busy.value = false
  if (ok) open.value = false
}
</script>
