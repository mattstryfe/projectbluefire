<template>
  <!-- Map / List view toggle (MER-9 placeholder). Flips the stage between the live map and a
       showings list/table. Not functional yet — which showings (posted vs claimed) is TBD. -->
  <v-sheet color="surface" rounded="pill" elevation="3" class="pa-1 d-inline-flex">
    <v-btn
      v-for="opt in options"
      :key="opt.value"
      @click="emit('update:modelValue', opt.value)"
      :color="modelValue === opt.value ? 'primary' : undefined"
      :variant="modelValue === opt.value ? 'flat' : 'text'"
      :prepend-icon="opt.icon"
      size="small"
      rounded="pill"
    >
      {{ opt.label }}
    </v-btn>
  </v-sheet>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: 'map' }
})
const emit = defineEmits(['update:modelValue'])

const options = [
  { value: 'map', label: 'Map', icon: 'mdi-map' },
  { value: 'list', label: 'List', icon: 'mdi-format-list-bulleted' }
]
</script>
