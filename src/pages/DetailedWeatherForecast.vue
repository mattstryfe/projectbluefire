<template>
  <v-row>
    <v-col>
      <h4> (DWF) Detailed Weather Forecast</h4>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <h4> Saved Locations</h4>
      <v-text-field  v-model="zip"></v-text-field>
      <v-btn icon="submit" @click="userStore.addUserLocationToProfile(zip)"></v-btn>
      <v-chip-group>
        <v-chip v-for="location in userInfo.savedLocations" :key="location.id">

        </v-chip>
      </v-chip-group>
      <pre>
        {{ userInfo }}
      </pre>

    </v-col>

  </v-row>
</template>

<script setup>
import {useUserStore} from "@/stores/userStore";
import {storeToRefs} from "pinia";
import {ref} from "vue";

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const zip = ref()

</script>

<style scoped>

</style>
