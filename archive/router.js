import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SWF from "./views/SWF.vue";
import BlogHome from "./views/Blog/BlogHome.vue";
import BlogPost from "./views/Blog/BlogPost.vue";
import Portfolio from './views/Portfolio.vue'
import Merc from './views/Merc.vue'
import nhl21 from '@/views/nhl21'
import DWF from '@/views/DWF'
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
      path: '/dwf',
      name: 'dwf',
      component: DWF
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
      path: '/fantasy',
      name: 'fantasy',
      component: Fantasy
    }
  ]
})
