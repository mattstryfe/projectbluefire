import firebase from "../firebaseConfig";
import axios from 'axios'
import dayjs from 'dayjs'
const db = firebase;
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

  get({endpoint, payload}) {
    return this.http.get(endpoint, {params: payload})
  }

  post({endpoint, payload, config}) {
    return this.http.post(endpoint, payload, config)
  }
}

const axi_weather = new AxiosService(wgovURL)
const axi_google = new AxiosService(googURL)


export async function checkDbFor(zip) {
  const docRef = db.collection('geo').doc(zip)

  const zipcodeEntry = await docRef.get()

  // if exists return geo data
  if (zipcodeEntry.exists)
    return zipcodeEntry.data()
  // if not, get it from google, add to DB, then return geo data
  else {
    const geoData = await zipToGeo(zip)
    docRef.set(geoData)
    return geoData
  }
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

export async function processWeatherData(rawWeatherData, targetProps) {
  // ------ Helper Functions --- //
  function generateArrayOfDates(duration) {
    let dateArr = []
    let today = dayjs()

    for (let i=0; i <= duration; i++)
      dateArr.push(today.add(i, 'days').format('YYYY-MM-DD'))

    return dateArr
  }

  function removePHP(val) {
    const newTime = val.validTime.substring(0, val.validTime.indexOf('+'))
    return { validTime: newTime, value: val.value }
  }

  function fixAndTrimThisData(rawData) {
    let tmpObj = {}
    for (let [key, vals] of Object.entries(rawData)) {
      if (targetProps.includes(key)) {
        tmpObj[key] = {
          sourceUnit: vals.sourceUnit,
          values : vals.values.map(x => removePHP(x))
        }
      }
    }
    return tmpObj
  }
  let fixedWeatherData = fixAndTrimThisData(rawWeatherData.properties)

  //------------ ^^^^ Everything above here... FIXES DATA ^^^^ ------------//
  // takes ~2.92ms //



  //----- Master object template ----- //
  class PropBuilder {
    constructor() {
      this.appendProps = Object.fromEntries(targetProps.map(prop =>
        [ prop, { sourceUnit: '', values : [] }]
      ))
    }
  }

  // Using the class constructor, build out the masterObject which will hold all the data
  // This contains nested dynamic properties, measurement keys, and data
  function buildMasterObj () {
    let tmpObj = {}

    generateArrayOfDates(5).forEach((date) => {
      const props = new PropBuilder()
      tmpObj[date] = props.appendProps
    })
    return tmpObj
  }

  let masterObj = buildMasterObj()

  // Now that the data is fixed (strippedWeatherData)
  // map all the entries and group them by date
  // While this occurring, append the grouped data to the masterObj
  // This allows only one iteration of each entry
  for (let [weatherPropKey, weatherPropEntries] of Object.entries(fixedWeatherData)) {
    weatherPropEntries.values.map(entry => groupByDate(entry, weatherPropKey, weatherPropEntries))
  }
  function groupByDate(entry, weatherPropKey, weatherPropEntries) {
    let entryDate = dayjs(entry.validTime).format('YYYY-MM-DD')

    if (masterObj.hasOwnProperty(entryDate)) {
      masterObj[entryDate][weatherPropKey].values.push(entry)
      masterObj[entryDate][weatherPropKey].sourceUnit = weatherPropEntries.sourceUnit
    }
  }
  return masterObj
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
