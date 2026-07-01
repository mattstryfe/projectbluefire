<template>
  <!-- MER-52 side panel: shows the clicked node's payload + forks (mirrors the chat proof-of-concept).
       Presentational only — the selected node is passed in; layer color/icon come from the config map. -->
  <v-navigation-drawer @update:model-value="handleDrawerToggle" :model-value="!!node" location="right" width="380" temporary>
    <template v-if="node">
      <v-toolbar :color="layerMeta.color" density="comfortable">
        <v-icon :icon="layerMeta.icon" class="ms-4" />
        <v-toolbar-title class="text-body-1 font-weight-medium">
          {{ node.label }}
        </v-toolbar-title>
        <v-btn @click="emit('close')" icon="mdi-close" variant="text" size="small" />
      </v-toolbar>

      <v-list density="comfortable" lines="two">
        <v-list-item :subtitle="layerMeta.label" title="Layer">
          <template #prepend>
            <v-icon icon="mdi-layers-outline" />
          </template>
        </v-list-item>
        <v-list-item v-if="node.source" :subtitle="node.source" title="Source">
          <template #prepend>
            <v-icon icon="mdi-file-code-outline" />
          </template>
        </v-list-item>
        <v-list-item v-if="node.exportName" :subtitle="node.exportName" title="Verified export">
          <template #prepend>
            <v-icon icon="mdi-check-decagram-outline" color="success" />
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-card-text>
        <p class="text-overline text-medium-emphasis mb-1">
          Payload
        </p>
        <p class="text-body-2">
          {{ node.payload }}
        </p>
      </v-card-text>

      <template v-if="node.forks?.length">
        <v-divider />
        <v-card-text>
          <p class="text-overline text-medium-emphasis mb-2">
            Forks / branches
          </p>
          <v-list density="compact" class="py-0">
            <v-list-item v-for="(fork, i) in node.forks" :key="i" :title="fork" class="px-0">
              <template #prepend>
                <v-icon icon="mdi-source-branch" size="small" color="medium-emphasis" />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </template>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { MERC_FLOW_LAYERS } from '@/configs/mercDefaults'

const props = defineProps({
  // The selected flow node (from mercFlowModel), or null when nothing is selected.
  node: { type: Object, default: null }
})
const emit = defineEmits(['close'])

// Fall back to a neutral shape if a node ever carries an unknown layer, so the panel never crashes.
const layerMeta = computed(
  () => MERC_FLOW_LAYERS[props.node?.layer] ?? { label: props.node?.layer ?? '—', color: 'grey', icon: 'mdi-help-circle-outline' }
)

// The drawer's own dismiss (scrim click / Esc) sets model-value false — bubble it as a close so the
// parent clears its selection (single source of truth for "which node is open").
function handleDrawerToggle(isOpen) {
  if (!isOpen) emit('close')
}
</script>
