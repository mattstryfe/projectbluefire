import axios from 'axios'
const wgovURL = process.env.VUE_APP_WGOV_BASE_ENDPOINT
const googURL = process.env.VUE_APP_GOOG_BASE_ENDPOINT
const googKey = process.env.VUE_APP_GOOG_CLIENT_KEY
const blueURL = process.env.NODE_ENV === 'production'
  ? 'https://us-central1-project-bluefire-api.cloudfunctions.net/app'
  : `http://${location.hostname}:5000/project-bluefire-api/us-central1/app`
// old `http://${location.hostname}:5000/project-bluefire-api/us-central1/app`

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
  post ({ endpoint, payload, config }) {
    return this.http.post(endpoint, payload, config)
  }
}

const axi_weather = new AxiosService(wgovURL)
const axi_google = new AxiosService(googURL)

export async function api_zipToGeo(zip) {
  let res
  try {
    res = await axios.get(
      `${blueURL}/geo`, {params: { zip:  zip }}
    )
  }
  catch (err) {
    console.log('err', err)
  }
  return res
}

export async function getWeatherAlerts(geoLoc) {
  let alerts,
    // TODO: this is not always the same
    state = geoLoc.address_components[3].short_name
  try {
    alerts = await axi_weather.get({
      endpoint: `/alerts/active?status=actual&message_type=alert&area=${state}`
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return alerts
}

export async function gridToForecast(gridProps) {
  let forecast,
    cwa = gridProps.cwa,
    x = gridProps.gridX,
    y = gridProps.gridY
  try {
    forecast = await axi_weather.get({
      endpoint:`/gridpoints/${cwa}/${x},${y}`
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return forecast
}

export async function geoToGrid(geoData) {
  let grid,
    lat = geoData.geometry.location.lat,
    lng = geoData.geometry.location.lng
  try {
    grid = await axi_weather.get({
      endpoint: `/points/${lat},${lng}`
    })
  }
  catch(err) {
    console.log('err', err)
  }
  console.log('grid raw', grid)
  return grid.data.properties
}

export async function zipToGeo(zip) {
  let geo
  try {
    geo = await axi_google.post({
      endpoint: `/geocode/json?address=${zip}`,
      payload: null,
      config: { params: { key: googKey }}
    })
  }
  catch(err) {
    console.log('err', err)
  }
  return geo.data.results[0]
}
