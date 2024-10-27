import { createRouter, createWebHistory } from 'vue-router'
// import AddEntryPage from '@/pages/AddEntryPage.vue'
import LandingPage from '@/pages/LandingPage.vue'
// import FlockManagerPage from '@/pages/FlockManagerPage.vue'
// import EntryDetailsPage from '@/pages/EntryDetailsPage.vue'
// import { useUserStore } from '@/stores/userStore'

const routes = [
  {
    name: 'LandingPage',
    path: '/',
    component: LandingPage
  },
  // { name: 'AddEntry', path: '/addentry', component: AddEntryPage },
  // { name: 'FlockManager', path: '/flockmanager', component: FlockManagerPage },
  // { name: 'EntryDetails', path: '/entrydetails/:id', component: EntryDetailsPage, props: true }

]
// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

router.beforeEach(async (to) => {
  // If not authed
  // TODO: Uncomment for actual permissions.
  // if (to.name !== 'LandingPage' && !useUserStore().userIsAuthenticated) {
  //   return { name: 'LandingPage'}
  // }
})

export default router
