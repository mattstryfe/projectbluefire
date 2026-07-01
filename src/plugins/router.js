import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/schemas/routerLinksSchema'
import { MERC_FLOW_PATH, MERC_FLOW_ROUTE_NAME } from '@/configs/mercDefaults'

const internalRoutes = routes.filter((r) => r.path.startsWith('/'))

// MER-52: dev-only data-flow visualization. Registered here (NOT in routerLinksSchema) and gated on
// import.meta.env.DEV so it's tree-shaken out of production builds and never leaks into any nav. Vite
// statically eliminates this branch when building, so the lazy-imported page never enters the bundle.
if (import.meta.env.DEV) {
  internalRoutes.push({
    name: MERC_FLOW_ROUTE_NAME,
    path: MERC_FLOW_PATH,
    component: () => import('@/pages/MercFlow.vue')
  })
}

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes: internalRoutes // short for `routes: routes`
})

// router.beforeEach(async (to) => {
// If not authed
// TODO: Uncomment for actual permissions.
// if (to.name !== 'LandingPage' && !useUserStore().userIsAuthenticated) {
//   return { name: 'LandingPage'}
// }
// })

export default router
