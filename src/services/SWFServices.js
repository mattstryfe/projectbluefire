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

export async function gridToForecast(grid_props) {
  let forecast,
    cwa = grid_props.cwa,
    x = grid_props.x,
    y = grid_props.y
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

export async function geoToGrid(lat, lng, zip) {
  let grid
  try {
    grid = await axi_weather.get({
      endpoint: `/points/${lat},${lng}`
    })
  }
  catch(err) {
    console.log('err', err)
  }

  // Minor formatting adjustments to line everything up
  let grid_props = {
    cwa: grid.data.properties.cwa,
    x: grid.data.properties.gridX,
    y: grid.data.properties.gridY
  }

  // Append to DB for next time!
  // This check prevents action during autoUserLoc()
  if (zip) {
    const docRef = db.collection('geo').doc(zip)
    docRef.update({ grid_props })
  }
  return grid_props
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

  return docRef.get()
    .then(async (doc) => {
      if (doc.exists)
        return doc.data()
      else {
        let geoData = await zipToGeo(zip)
        await docRef.set(geoData)
        return geoData
      }
  })

}
