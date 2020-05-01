import axios from 'axios'
import firebase from "../firebaseConfig";
const wgovURL = process.env.VUE_APP_WGOV_BASE_ENDPOINT
const googURL = process.env.VUE_APP_GOOG_BASE_ENDPOINT
const googKey = process.env.VUE_APP_GOOG_CLIENT_KEY
const db = firebase.firestore();

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
  /* TODO: this logic needs to catch varying responses.
     address_components doesnt always store state in [3]
  */
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

export async function checkDbFor(zip) {
  const docRef = db.collection('geo').doc(zip)

  return docRef.get().then(async function(doc) {
    if (doc.exists) {
      console.log('Entry exists in DB')
      return doc.data()
    } else {
      console.log('No entry!  Making one...')
      // Go get google things
      let geoResponse =  await zipToGeo(zip)

      await docRef.set(geoResponse)
      return geoResponse
    }
  })

}
