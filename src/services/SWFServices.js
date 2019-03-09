import axios from 'axios';

export const getLandAlerts = axios.create({
  // headers: {
  //   'Content-type': 'application/geo+json',
  //   'Accept': 'application/geo+json',
  //   'Access-Control-Allow-Origin': '*',
  //   'UserAgent': 'Project Bluefire',
  //   'Access-Control-Request-Headers': 'Content-Type',
  // },
  baseURL: 'https://api.weather.gov/alerts/active',
  params: {
    status: 'actual',
    area: 'VA'
  }
});


