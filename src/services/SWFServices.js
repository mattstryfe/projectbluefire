import axios from 'axios'
const wgovURL = process.env.VUE_APP_WGOV_BASE_ENDPOINT
const googURL = process.env.VUE_APP_GOOG_BASE_ENDPOINT
const googKey = process.env.VUE_APP_GOOG_CLIENT_KEY

class AxiosService {
  constructor(url) {
    this.http = axios.create({
      baseURL: url,
      timeout: 15000,
    })
  }
  get ({ endpoint, payload }) {
    return this.http.get(endpoint, { params: payload })
  }
  post ({ endpoint, payload }) {
    return this.http.post(
      endpoint,
      payload,
      { params:  { key: googKey } })
  }
}

const axi_weather = new AxiosService(wgovURL)
const axi_google = new AxiosService(googURL)

export async function zipToGeo(zip) {
  let geo
  try {
    geo = await axi_google.post({
      endpoint: `/geocode/json?address=${zip}`,
    })
  }
  catch(err) {
    console.log('err', err)
  }
  return geo
}



export const weatherGovAPI = axios.create({
  headers: {
    'Content-type': 'application/geo+json',
    'Accept': 'application/geo+json',
    // 'Access-Control-Allow-Origin': '*',
    // 'UserAgent': 'Project Bluefire',
    // 'Access-Control-Request-Headers': 'Content-Type',
  },
  baseURL: 'https://api.weather.gov',
  params: {
    // status: 'actual',
    // area: 'PA'
  }
})

export const googleGeoLocAPI = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/json?address=',
  params: {
    key: process.env.VUE_APP_GOOGLE_CLIENT_KEY
  }
})

// export const weatherGovAPI = axios.create({
//   baseURL: 'https://api.weather.gov/points/',
//   params: {}
// })
