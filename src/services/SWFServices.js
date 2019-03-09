import axios from 'axios';

export const weatherGovAPI = axios.create({
  // headers: {
  //   'Content-type': 'application/geo+json',
  //   'Accept': 'application/geo+json',
  //   'Access-Control-Allow-Origin': '*',
  //   'UserAgent': 'Project Bluefire',
  //   'Access-Control-Request-Headers': 'Content-Type',
  // },
  baseURL: 'https://api.weather.gov',
  params: {
    status: 'actual',
    // area: 'PA'
  }
});


