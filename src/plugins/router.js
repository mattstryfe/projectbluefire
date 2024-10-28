import { createRouter, createWebHistory } from 'vue-router'
import { routerLinksSchema } from '@/schemas/routerLinksSchema'

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes: routerLinksSchema, // short for `routes: routes`
})

router.beforeEach(async (to) => {
  // If not authed
  // TODO: Uncomment for actual permissions.
  // if (to.name !== 'LandingPage' && !useUserStore().userIsAuthenticated) {
  //   return { name: 'LandingPage'}
  // }
})

export default router
export { routerLinksSchema }  // re-export it
