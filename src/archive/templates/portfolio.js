export const skills =  [
  { name: 'JQuery', years_exp: '3', icon: 'fab fa-js', color: 'blue lighten-4' },
  { name: 'Vue.js', years_exp: '4', icon: 'fab fa-vuejs', color: 'green lighten-2' },
  { name: 'VUEX', years_exp: '4', icon: 'fab fa-vuejs',  color: 'green lighten-2' },
  { name: 'Vuetify', years_exp: '4', icon: 'fab fa-vuejs', color: 'blue lighten-2' },
  { name: 'Scrum', years_exp: '3', icon: '', color: '' },
  { name: 'Cesium', years_exp: '1', icon: 'fa-globe', color: 'blue darken-2' },
  { name: 'Bootstrap', years_exp: '1', icon: 'fab fa-bootstrap', color: 'purple lighten-2' },
  { name: 'AngularJS', years_exp: '2', icon: 'fab fa-angular', color: 'red lighten-2' },
  { name: 'leaflet', years_exp: '2', icon: 'fa-leaf', color: 'green darken-2' },
  { name: 'Turf.js', years_exp: '1', icon: 'fa-satellite', color: 'green lighten-4' },
  { name: 'JavaScript', years_exp: '6', icon: 'fab fa-js', color: 'yellow lighten-2' },
  { name: 'Vis.js', years_exp: '1', icon:'fa-cubes', color: 'orange lighten-2' },
  { name: 'D3.js', years_exp: '1', icon:'fa-cubes', color: 'orange darken-2' },
  { name: 'ElasticSearch', years_exp: '1', icon:'fa-search', color: 'teal' },
  { name: 'AGILE/SAFE', years_exp: '4', icon:'', color: '' },
  { name: 'AWS', years_exp: '3', icon: 'fab fa-aws', color: 'orange lighten-1' },
  { name: 'Linux', years_exp: '8', icon: 'fab fa-linux', color: '' },
  { name: 'Ubuntu', years_exp: '7', icon: 'fab fa-ubuntu', color: 'orange darken-1' },
  { name: 'HighCharts', years_exp: '3', icon:'fa-chart-area', color: 'purple lighten-1' },
]

export const courses = [
  { title: 'AWS Certified Solutions Architect', date: '2016' },
  { title: 'AWS Sys Ops', date: '2016' },
  { title: 'Redhat: RH214', date: '2016' },
  { title: 'AWS Architecting on AWS', date: '2016' },
  { title: 'MCSD: Developing ASP.NET', date: '2016' },
  { title: 'Commercial Cloud Services', date: '2016' },
  { title: 'ITIL Foundations', date: '2015' },
  { title: 'MCSD: Javascript/HTML/CSS', date: '2015' },
  { title: 'Sharepoint Designer 2010', date: '2015' },
  { title: 'PMP: PMP Bootcamp', date: '2006' },
]

export const credentials = [
  { title: 'B.S. Information Technology Management',
    origin: 'American Military University',
    date: '2016'
  },
  { title: 'A.S. Information Systems Technology',
    origin: 'Community College of the Air Force',
    date: '2014'
  },
  { title: 'Certified Scrum Master',
    origin: '',
    date: '2020'
  },
  { title: 'Security+',
    origin: 'Comptia',
    date: '2016'
  },
  { title: 'ITIL Foundations',
    origin: '',
    date: '2015'
  }
]

export const positions = [
  {
    year: 2020,
    company: 'MAXAR',
    text_color: 'yellow--text',
    title: 'Scrum Master / Lead Front End Developer',
    tech: [
      { name: 'Vue.js', icon: 'fab fa-vuejs', color: 'green lighten-2' },
      { name: 'VUEX', icon: 'fab fa-vuejs',  color: 'green lighten-2' },
      { name: 'Vuetify', icon: 'fab fa-vuejs', color: 'blue lighten-2' },
      { name: 'Cesium', icon: 'fa-globe', color: 'blue darken-2' }
    ],
    highlight: 'Led & executed ground up development of Vue.js App.',
    details: '  Cultivated and deployed stakeholder vision from concept to reality < 8 months during pandemic.'
  },
  {
    year: 2019,
    company: 'MAXAR',
    text_color: 'yellow--text',
    title: 'Lead Front End Developer',
    tech: [
      { name: 'Vue.js', icon: 'fab fa-vuejs', color: 'green lighten-2' },
      { name: 'Bootstrap', icon: 'fab fa-bootstrap', color: 'purple lighten-2' },
      { name: 'AngularJS', icon: 'fab fa-angular', color: 'red lighten-2' }
    ],
    highlight: 'Executed rebuild of AngularJS App.',
    details: 'Built and deployed Vue.js & Micronaut App.' +
      '  Constructed from the ground up. ' +
      '  First of its kind and virtually no templates, guides, or pre configuration files.'
  },
  {
    year: 2018,
    company: 'Invictus',
    icon: '@/assets/images/portfolio/invictus-logo.png',
    text_color: '',
    title: 'Lead Front End Developer',
    tech: [
      { name: 'Vue.js', icon: 'fab fa-vuejs', color: 'green lighten-2' },
      { name: 'leaflet', icon: 'fa-leaf', color: 'green darken-2' },
      { name: 'Turf.js', icon: 'fa-satellite', color: 'green lighten-4' },
      { name: 'AngularJS', icon: 'fab fa-angular', color: 'red lighten-2'  }
    ],
    highlight: ' Stand-in Lead for multiple sprint cycles.',
    details: '  Built and integrated Leaflet powered interactive map component.' +
      '  Introduced real-time geospatial storm tracking and personnel checks within alert areas.'
  },
  {
    year: 2017,
    company: 'Invictus',
    text_color: '',
    title: 'Front End Developer',
    tech: [
      { name: 'AngularJS', icon: 'fab fa-angular', color: 'red lighten-2'  }
    ],
    highlight: 'Implemented full-state support across application.',
    details: '  Built & Integrated user history, word cloud, summary window, and text comparison tool'
  },
  {
    year: 2012,
    company: 'U.S.A.F.',
    text_color: 'blue--text',
    title: 'Front End Developer',
    tech: [
      { name: 'JavaScript', icon: 'fab fa-js', color: 'yellow lighten-2' },
      { name: 'JQuery', icon: 'fab fa-js', color: 'blue lighten-4' },
      { name: 'SPServices', icon:'fa-server', color: 'blue' },
      { name: 'SharePoint', icon: 'fab fa-microsoft', color: 'blue' }
    ],
    highlight: 'Designed and Built various dynamic dashboard using bootstrap, jquery, and SPDesigner.',
    details: '  Built & Integrated user history, word cloud, summary window, and text comparison tool.'
  },
  {
    year: 2008,
    company: 'U.S.A.F.',
    text_color: 'blue--text',
    title: 'Project Engineer / Integrator',
    tech: [
      { name: 'Project Management', icon: 'fa-tasks', color: 'orange lighten-2' },
      { name: 'SharePoint', icon: 'fab fa-microsoft', color: 'blue'  }
    ],
    highlight: 'Designed, purchased, and built a 1.1M test lab for VTC accreditation.',
    details: '  Developed and headed 2 major program off-site conferences.'
  },
]
