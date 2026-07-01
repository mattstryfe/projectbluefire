// MER-52 anti-drift check (dev-time runtime assertion).
//
// The ticket requires a guard so node ids that reference store/worker EXPORTS can't silently fall out
// of sync with the real code. There is NO test runner configured in this repo (no vitest/jest — see
// package.json), so per the ticket's stated fallback this is a DEV-ONLY runtime check that
// console.warn()s on mismatch rather than a unit test. It is invoked from MercFlow.vue's onMounted,
// itself only reachable on the dev-only /merc/flow route, so it never runs in production.
//
// It resolves each flow node's declared `exportName` against the ACTUAL module namespace (star-imported
// below) and reports:
//   • nodes whose exportName does not exist as a real exported member, and
//   • edges that reference a non-existent node id (internal model integrity).

import * as mercShowingsStore from '@/stores/mercShowingsStore.js'
import * as mercShowingsWorker from '@/workers/mercShowingsWorker.js'
import * as mercAuthStore from '@/stores/mercAuthStore.js'
import { nodes, edges } from '@/components/merc/flow/mercFlowModel.js'

// Which real module namespace backs a given node. Store-layer nodes split between the showings store
// and the auth store, so route by node id prefix; worker-layer nodes all come from the showings worker.
function moduleForNode(node) {
  if (node.layer === 'worker') return mercShowingsWorker
  if (node.layer === 'store') return node.id.startsWith('auth') ? mercAuthStore : mercShowingsStore
  return null // component / firestore / realtime nodes name no export — nothing to resolve
}

/**
 * Verify the flow model against the real code + itself. Returns the problems (also console.warn'd) so a
 * caller could surface them; an empty array means the model is consistent.
 * @returns {{ node:string, issue:string }[]}
 */
export function checkMercFlowModel() {
  const problems = []
  const nodeIds = new Set(nodes.map((n) => n.id))

  // 1. Every store/worker node's exportName must resolve to a real exported member.
  for (const node of nodes) {
    const mod = moduleForNode(node)
    if (!mod) continue
    if (!node.exportName) {
      problems.push({ node: node.id, issue: `${node.layer} node is missing an exportName to anchor` })
      continue
    }
    if (!(node.exportName in mod)) {
      problems.push({
        node: node.id,
        issue: `exportName "${node.exportName}" is not exported by its ${node.layer} module`
      })
    }
  }

  // 2. Every edge must reference existing node ids (internal model integrity).
  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) problems.push({ node: edge.id, issue: `edge source "${edge.source}" is not a known node` })
    if (!nodeIds.has(edge.target)) problems.push({ node: edge.id, issue: `edge target "${edge.target}" is not a known node` })
  }

  if (problems.length) {
    console.warn(
      `[merc] MER-52 flow model drift — ${problems.length} issue(s); the /merc/flow graph no longer ` +
        'matches the real store/worker exports. Update src/components/merc/flow/mercFlowModel.js:',
      problems
    )
  } else {
    console.info('[merc] MER-52 flow model OK — all node exports resolve and every edge is connected.')
  }
  return problems
}
