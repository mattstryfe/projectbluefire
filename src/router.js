import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SWF from "./views/SWF";
import BlogHome from "./views/Blog/BlogHome";
import BlogPost from "./views/Blog/BlogPost";
import Portfolio from './views/Portfolio'
import Merc from './views/Merc'
import nhl21 from '@/views/nhl21'
import Fantasy from '@/views/Fantasy'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/swf',
      name: 'swf',
      component: SWF
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogHome
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPost
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: Portfolio
    },
    {
      path: '/merc',
      name: 'merc',
      component: Merc
    },
    {
      path: '/Nhl21',
      name: 'nhl21',
      component: nhl21
    },
    {
      path: '/Fantasy',
      name: 'Fantasy Hockey',
      component: Fantasy
    },

  ]
})
