import axios from 'axios'
import firebase from "../firebaseConfig";
const wgovURL = process.env.VUE_APP_WGOV_BASE_ENDPOINT

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
