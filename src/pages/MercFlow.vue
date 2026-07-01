<template>
  <!-- MER-52: interactive, data-driven Merc data-flow map — the LIVING version of MERC.md's
       "## Data flow" diagrams. DEV-ONLY route (/merc/flow, registered only under import.meta.env.DEV).
       Node/edge click → side panel with that node's payload + forks. The graph is a pure render over
       mercFlowModel.js; adding a step means editing the model, not this file. Uses only @vue-flow/core
       (the sole dependency approved for this ticket) — no Background/Controls/MiniMap plugin packages. -->
  <v-container fluid class="pa-0 merc-flow" :style="canvasStyle">
    <VueFlow
      @node-click="handleNodeClick"
      @edge-click="handleEdgeClick"
      :nodes="flowNodes"
      :edges="flowEdges"
      :min-zoom="MERC_FLOW_MIN_ZOOM"
      :max-zoom="MERC_FLOW_MAX_ZOOM"
      :fit-view-on-init="true"
    >
      <!-- Layer legend, driven off the same config map the nodes use (Panel = @vue-flow/core built-in). -->
      <Panel position="top-left">
        <v-card class="merc-flow__legend" density="compact" rounded="lg" elevation="4">
          <v-list density="compact" class="py-1">
            <v-list-subheader class="text-caption">
              Merc data flow (MER-52)
            </v-list-subheader>
            <v-list-item v-for="(meta, key) in MERC_FLOW_LAYERS" :key="key" :title="meta.label" density="compact">
              <template #prepend>
                <v-icon :icon="meta.icon" :color="meta.color" size="small" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </Panel>
    </VueFlow>

    <merc-flow-side-panel @close="handleClosePanel" :node="selectedNode" />
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { VueFlow, Panel } from '@vue-flow/core'
import MercFlowSidePanel from '@/components/merc/flow/MercFlowSidePanel.vue'
import { nodes, edges } from '@/components/merc/flow/mercFlowModel.js'
import { checkMercFlowModel } from '@/components/merc/flow/mercFlowModelCheck.js'
import {
  MERC_FLOW_LAYERS,
  MERC_FLOW_MIN_ZOOM,
  MERC_FLOW_MAX_ZOOM,
  MERC_FLOW_TOP_OFFSET_PX
} from '@/configs/mercDefaults'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

// Fill the viewport below BlueFire's app bar (this route keeps BlueFire chrome — it's a dev tool, not
// the Merc shell). Height is derived from a config constant, not a magic literal in <style>.
const canvasStyle = { height: `calc(100vh - ${MERC_FLOW_TOP_OFFSET_PX}px)` }

const selectedNode = ref(null)

// Map the domain model → Vue Flow's node shape. Color/border come from the layer config; the raw model
// node is stashed in `data` so a click can open the side panel without a second lookup.
const flowNodes = computed(() =>
  nodes.map((node) => {
    const meta = MERC_FLOW_LAYERS[node.layer]
    return {
      id: node.id,
      position: node.position,
      data: node,
      label: node.label,
      style: {
        border: `2px solid ${meta.color}`,
        borderRadius: '10px',
        background: 'rgba(15, 23, 42, 0.92)',
        color: '#e2e8f0',
        width: '210px',
        fontSize: '12px',
        padding: '8px 10px'
      }
    }
  })
)

// Edge shape. Subscription/realtime edges animate + dash so a live listener reads differently from an
// imperative call; the raw model edge is stashed in `data` for the click handler.
const flowEdges = computed(() =>
  edges.map((edge) => {
    const isLive = edge.kind === 'realtime' || edge.kind === 'subscription'
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      data: edge,
      animated: isLive,
      style: { stroke: isLive ? '#a855f7' : '#64748b', strokeDasharray: isLive ? '6 4' : undefined },
      labelBgStyle: { fill: '#0f172a' },
      labelStyle: { fill: '#cbd5e1', fontSize: '11px' }
    }
  })
)

function handleNodeClick({ node }) {
  selectedNode.value = node.data
}

// Edge click surfaces the DOWNSTREAM node's detail — the payload arriving at that step is the useful
// context for an edge, and it reuses the same panel.
function handleEdgeClick({ edge }) {
  selectedNode.value = nodes.find((n) => n.id === edge.target) ?? null
}

function handleClosePanel() {
  selectedNode.value = null
}

// Dev-only anti-drift guard: warn if any node's exportName no longer resolves to a real store/worker
// export, or an edge references a missing node. Reachable only on the dev-only route, but gate anyway.
onMounted(() => {
  if (import.meta.env.DEV) checkMercFlowModel()
})
</script>

<style scoped>
.merc-flow {
  position: relative;
}

.merc-flow__legend {
  opacity: 0.95;
}
</style>
