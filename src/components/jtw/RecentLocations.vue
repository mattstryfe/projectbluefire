<template>
  <v-row>
    <!-- TODO: TG-49 - move recent locations into zipcode dropdown -->
    <v-col>
      <h6 class="sn">
        Recent Locations:
      </h6>
      <zipcode-chip />
    </v-col>
  </v-row>
</template>

<script setup>
import ZipcodeChip from '@/components/jtw/ZipcodeChip.vue'
</script>

<style scoped></style>
