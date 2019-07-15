// Packages
import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import TreeView from 'vue-json-tree-view'

// Components
import Home from '@/common/Home'
import SWF from '@/pages/SWF'
import BlogHome from '@/pages/Blog/BlogHome'
import BlogPost from '@/pages/Blog/BlogPost'

Vue.use(Router)
Vue.use(Vuetify)
Vue.use(VueResource)
Vue.use(TreeView)

export default new Router({
  mode: 'history',
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
    {
      path: '/blog',
      name: 'blog-home',
      component: BlogHome
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPost
    }
  ]
})
