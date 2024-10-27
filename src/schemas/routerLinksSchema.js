import LandingPage from "@/pages/LandingPage.vue";
import SimpleWeatherForecast from "@/pages/SimpleWeatherForecast.vue";
import DetailedWeatherForecast from "@/pages/DetailedWeatherForecast.vue";
import Blog from "@/pages/Blog.vue";
import Portfolio from "@/pages/Portfolio.vue";

export default [
  {
    name: 'LandingPage',
    path: '/',
    component: LandingPage,
    icon: 'mdi-weather-cloudy',
    color: 'info',
    class: 'hover-gradient',
  },
  {
    name: '(SWF) Simple Weather Forecast',
    path: '/simple-weather-forecast',
    component: SimpleWeatherForecast,
    icon: 'mdi-weather-cloudy',
    color: 'info',
    class: 'hover-gradient'
  },
  {
    name: '(DWF) Detailed Weather Forecast',
    path: '/detailed-weather-forecast',
    component: DetailedWeatherForecast,
    icon: 'mdi-weather-cloudy-alert',
    color: 'orange-darken-3',
    class: 'hover-gradient'
  },
  {
    name: 'Blog',
    path: '/blog',
    component: Blog,
    icon: 'mdi-post',
    color: 'yellow-lighten-2',
    class: 'hover-gradient',
    isDisabled: true,
  },
  {
    name: 'Portfolio',
    path: '/portfolio',
    component: Portfolio,
    icon: 'mdi-script-text',
    color: 'indigo-darken-1',
    class: 'hover-gradient',
    isDisabled: true,
  }
]
