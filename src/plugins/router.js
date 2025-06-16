import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/schemas/routerLinksSchema'

const internalRoutes = routes.filter((r) => r.path.startsWith('/'))

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
