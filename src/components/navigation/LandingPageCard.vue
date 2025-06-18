<template>
  <v-col sm="6" lg="4" cols="12" class="pa-5">
    <v-card
      @click="navigate(card)"
      class="flex-grow-1 border-sm text-center pa-2"
      :disabled="card.isDisabled"
    >
      <v-card-title>
        <v-icon :icon="card.icon" size="125" :color="card.color"></v-icon>
      </v-card-title>
      <v-card-title class="text-h5 mt-n5">
        {{ card.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ card.details }}
      </v-card-subtitle>
      <v-card-actions>
        <v-chip
          v-for="chip in card.chips"
          :key="chip"
          variant="outlined"
          density="compact"
          class="text-grey"
        >
          {{ chip }}
        </v-chip>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script setup>
import { useNavigation } from '@/composables/useNavigation'
const { navigate } = useNavigation()

const { card } = defineProps({
  card: {
    type: Object,
    required: true
  }
})
</script>

<style scoped></style>
