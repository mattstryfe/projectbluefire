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
  post ({ endpoint, payload, config }) {
    return this.http.post(endpoint, payload, config)
  }
}

const axi_weather = new AxiosService(wgovURL)
const axi_google = new AxiosService(googURL)

export async function getWeatherAlerts(geoLoc) {
  let alerts,
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

export async function gridToForecast(gridURL) {
  let forecast
  axi_weather.http.defaults['baseURL'] = gridURL
  try {
    forecast = await axi_weather.get({})
  }
  catch (err) {
    console.log('err', err)
  }
  return forecast
}

export async function geoToGrid(geo) {
  let grid,
    lat = geo.geometry.location.lat,
    lng = geo.geometry.location.lng
  try {
    grid = await axi_weather.get({
      endpoint: `/points/${lat},${lng}`
    })
  }
  catch(err) {
    console.log('err', err)
  }
  console.log('grid raw', grid)
  return grid.data.properties.forecastGridData
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
