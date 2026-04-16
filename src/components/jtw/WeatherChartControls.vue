<template>
  <div class="chart-controls d-flex ga-2 mb-2">
    <v-btn
      @click="toggle('showFreezeLine')"
      size="small"
      variant="outlined"
      :color="toggles.showFreezeLine ? 'primary' : undefined"
    >
      <v-icon start>mdi-snowflake</v-icon>
      Freeze Line
    </v-btn>

    <v-btn @click="cycleGradientMode" size="small" variant="outlined">
      <v-icon start>mdi-gradient-horizontal</v-icon>
      {{ gradientLabel }}
    </v-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  toggles: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'cycleGradient'])

function toggle(key) {
  emit('toggle', key)
}

function cycleGradientMode() {
  emit('cycleGradient')
}

const gradientLabel = computed(() => {
  const labels = {
    icyToDark: 'Icy → Dark',
    darkToIcy: 'Dark → Icy',
    none: 'No Gradient'
  }
  return labels[props.toggles.gradientMode]
})
</script>
