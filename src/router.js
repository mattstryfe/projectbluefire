import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import SWF from "./views/SWF";
import BlogHome from "./views/Blog/BlogHome";
import BlogPost from "./views/Blog/BlogPost";
import SWFbak from "./views/SWFbak";

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
      path: '/swfbak',
      name: 'swfbak',
      component: SWFbak
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
