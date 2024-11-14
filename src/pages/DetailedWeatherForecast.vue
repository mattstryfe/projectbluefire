<template>
  <v-row>
    <v-col>
      <h4>(DWF) Detailed Weather Forecast</h4>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <h4>Saved Locations</h4>
      <v-text-field v-model="zip"></v-text-field>
      <v-btn
        @click="userStore.addThisSavedLocation(zip)"
        icon="submit"
      >Save Current Location</v-btn>
      <v-chip-group>
        <v-chip v-for="zip in getUserSavedZipCodeList" :key="zip">
          {{ zip }}
        </v-chip>
      </v-chip-group>
      <pre>
        {{ userInfo }}
      </pre>
    </v-col>
  </v-row>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import {computed, ref} from 'vue'

const userStore = useUserStore()
const { userInfo, getUserSavedZipCodeList } = storeToRefs(userStore)
const zip = ref()

</script>

<style scoped></style>
