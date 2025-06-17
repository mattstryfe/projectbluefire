export const routes = [
  {
    name: 'LandingPage',
    path: '/',
    hideInMainNav: true,
    component: () => import('@/pages/LandingPage.vue'),
    icon: 'mdi-weather-cloudy',
    color: 'info',
    class: ''
  },
  {
    name: '(SWF) Simple Weather Forecast',
    bottomNavName: 'SWF',
    path: '/simple-weather-forecast',
    component: () => import('@/pages/SimpleWeatherForecast.vue'),
    icon: 'mdi-weather-cloudy',
    color: 'info',
    class: '',
    details: 'A basic (and old) forecaster.',
    chips: ['In development', 'Updated'],
    showInMobileNav: true
  },
  {
    name: '(DWF) Detailed Weather Forecast',
    bottomNavName: 'DWF',
    path: '/detailed-weather-forecast',
    component: () => import('@/pages/DetailedWeatherForecast.vue'),
    icon: 'mdi-weather-cloudy-alert',
    color: 'orange-darken-3',
    class: '',
    details: 'An updated forecaster with more details and features.',
    chips: ['In development', 'Updated'],
    showInMobileNav: true
  },
  {
    name: 'Blog',
    bottomNavName: 'Blog',
    path: '/blog',
    component: () => import('@/pages/Blog.vue'),
    icon: 'mdi-post',
    color: 'yellow-lighten-2',
    class: 'hover-gradient',
    isDisabled: false,
    details:
      'Capturing the new build, day-by-day. Also some ideas and current events.',
    chips: ['coming soon'],
    showInMobileNav: true
  },
  {
    name: 'BlogPost',
    path: '/blog/:postSlug',
    hideInMainNav: true,
    props: true,
    component: () => import('@/components/blog/BlogPostPage.vue'),
    icon: 'mdi-post',
    color: 'yellow-lighten-2',
    class: 'hover-gradient',
    isDisabled: false,
    details:
      'Capturing the new build, day-by-day. Also some ideas and current events.',
    chips: ['coming soon']
  },
  {
    name: 'Portfolio',
    isArchived: true,
    path: 'https://archives.projectbluefire.com/portfolio',
    icon: 'mdi-script-text',
    color: 'indigo-darken-1',
    class: 'hover-gradient',
    isDisabled: false,
    details: "Me, myself, and I.  Plus some of what I've done.",
    chips: ['coming soon']
  },
  {
    name: 'merc',
    isArchived: true,
    icon: 'mdi-earth',
    title: 'Merc',
    path: 'https://archives.projectbluefire.com/merc',
    color: 'teal lighten-1',
    details: 'Mock merc tracker. (Artisan/Operatives)',
    isDisabled: false,
    chips: ['Archived']
  },
  {
    name: 'nhl21',
    isArchived: true,
    icon: 'mdi-hockey-puck',
    title: 'NHL 21',
    path: 'https://archives.projectbluefire.com/nhl21',
    color: 'red lighten-1',
    details: 'Player creation tool',
    isDisabled: false,
    chips: ['Archived']
  },
  {
    name: 'Fantasy Mgmt',
    isArchived: true,
    icon: 'mdi-unicorn',
    title: 'Fantasy',
    path: 'https://archives.projectbluefire.com/fantasy',
    color: 'blue darken-4',
    details: 'Fantasy manager tool',
    isDisabled: false,
    chips: ['Archived']
  }
]
