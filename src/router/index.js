import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import TreeView from 'vue-json-tree-view';

// components

import Home from '@/components/Home'
import SWF from '@/components/SWF'

Vue.use(Router)
Vue.use(Vuetify)
Vue.use(VueResource)
Vue.use(TreeView)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/swf',
      name: 'SWF',
      component: SWF
    },
		// {
		// 	path: '/projects',
		// 	name: 'Projects',
		// 	component: Projects
		// },
		// {
		// 	path: '/blog',
		// 	name: 'Blog',
		// 	component: Blog
		// }

  ]
})
