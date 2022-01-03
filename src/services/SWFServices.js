import axios from 'axios'
import db from '../firebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
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

export function getAlertsByGeo(lat, lng) {
  let alerts
  try {
    alerts = axi_weather.get({
      endpoint: `/alerts/active?point=${lat},${lng}`
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return alerts
}

export function getAlertsByState(address_components) {
  const { short_name: state } = address_components.find(state => state.short_name.length === 2)

  let alerts
  try {
    alerts = axi_weather.get({
      endpoint: `/alerts/active/area/${state}`
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return alerts
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
  const zipRef = doc(db, 'geo', zip)
  const snapshotOfZip = await getDoc(zipRef)

  if (snapshotOfZip.exists()) {
    return snapshotOfZip.data()
  }
  else {
    // get geo coords
    const geoData = await zipToGeo(zip)

    // write to db for next time
    await setDoc(zipRef, geoData)

    return geoData
  }
}

