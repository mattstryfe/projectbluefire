<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      {{ user_lat }}, {{ user_lng }}
    </v-row>
    <v-row>
      <v-btn
        color="secondary"
        small
        @click="getWeatherData()"
      >
        Get Weather
      </v-btn>

      <v-btn
        class="ml-3"
        color="secondary"
        small
        @click="getTestData()"
      >
        get Test Data
      </v-btn>
    </v-row>
    <v-row>
      {{ finalWeatherData }}
    </v-row>
  </v-container>
</template>

<script>
// Services
import {weatherGovAPI, googleGeoLocAPI} from '@/services/SWFServices'
import moment from 'moment'
import { testData } from "../assets/data/testData";

export default {
  name: "SWF",
  props: {},
  components: {},
  data: function () {
    return {
      user_lat: null,
      user_lng: null,
      raw_weather: null,
      finalWeatherData: null,
      test_loc_details: {
        geo: {
          lat: 38.8629803,
          lng: -77.4816693
        },
        state: 'VA',
        zipcode: '20120',
        formatted_address: 'Sully Station, VA 20120, USA'
      },
      withTheseProps: [
        'apparentTemperature',
        'dewpoint',
        // 'heatIndex',
        // 'maxTemperature',
        // 'minTemperature',
        // 'relativeHumidity',
        // 'skyCover',
        // 'snowfallAmount',
        // 'temperature',
        // 'windDirection',
        // 'windSpeed',
        // 'windChill'
      ]
    }
  },
  created() {
    this.getUserLoc()
    // this.buildTimeObject()
  },
  destroyed() {
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
    processWeatherData2(rawWeatherData, targetProps) {
      console.log('rawWeatherData', rawWeatherData.properties)

      function removePHP(val) {
        const newVal = val.validTime.split('/')
        return { validTime: newVal[0], value: val.value }
      }

      function getData(rawData) {
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
      let strippedWeatherData = getData(rawWeatherData.properties)
      //------------ ^^^^ THIS FIXES DATA ^^^^ ------------//
      // takes ~2.92ms //



      //----- generate master object ----- //
      class PropBuilder {
        constructor(date) {
          this.appendProps = Object.fromEntries(targetProps.map(prop => [ prop, { sourceUnit: '', values : [] } ] ))
        }
      }

      function buildMasterObj () {
        let props = new PropBuilder()
        let masterObj = {}

        generateArrayOfDates(5).forEach((date) => {
          masterObj[date] = props.appendProps
        })
        return masterObj
      }
      let masterObj = buildMasterObj()
      console.log('masterObj', masterObj)

      //------------------------------------------//


      for (let [weatherPropKeys, weatherPropEntries] of Object.entries(strippedWeatherData)) {
        console.log('weatherPropKeys', weatherPropKeys, 'weatherPropEntries', weatherPropEntries);
        weatherPropEntries.values.map(entry => groupByDate(entry, weatherPropKeys, masterObj))
      }

      console.log('masterObj', masterObj)


      function groupByDate(entry, prop, masterObj) {
        let entryDate = moment(entry.validTime).utc().format('YYYY-MM-DD')

        // Append each prop no matter what
        // dateObj[entryDate] = {  }
        // dateObj[entryDate][prop] = { }
        // dateObj[entryDate][prop] = {}

        if (masterObj.hasOwnProperty(entryDate) && masterObj[entryDate].hasOwnProperty(prop)) {
          masterObj[entryDate][prop].values.push(entry)
          // dateObj[entryDate][prop] = { values : entry }
          // tmpArrOfValues.push({ [entryDate] : entry })
          // tmpArr.push( { [prop] : entry } )
        }
        // return { [entryDate] : { [prop] : entry }}
      }



      function generateArrayOfDates(duration) {
        let dateArr = []
        let today = moment()

        for (let i=0; i <= duration; i++)
          dateArr.push(today.clone().add(i, 'days').utc().format('YYYY-MM-DD'))

        return dateArr
      }

      // function getByDate(acc, val) {
      //   if( arrOfDates.includes(moment(removePHP(val)).utc().format('YYYY-MM-DD'))) {
      //     console.log('found one!')
      //     return val
      //   }
      // }
      //
      // for (let [key, vals] of Object.entries(strippedWeatherData)) {
      //   console.log('vals', vals)
      //   let sortedVals = vals.values.reduce(getByDate, [])
      //   console.log('sortedVals', sortedVals)
      // }

      },
    processWeatherData(rawWeatherData, targetProps) {
      console.log('rawWeatherData', rawWeatherData.properties)

      function removePHP(val) {
        const newVal = val.validTime.split('/')
        return newVal[0]
      }

      function generateArrayOfDates(duration) {
        let dateArr = []
        let today = moment()

        for (let i=0; i <= duration; i++)
          dateArr.push(today.clone().add(i, 'days').utc().format('YYYY-MM-DD'))

        return dateArr
      }

      class PropBuilder {
        constructor(date, rawWeatherData) {
          // this[date] = this.getData(date, rawWeatherData.properties)
          // this.filtered = this.filteredData(date, rawWeatherData.properties)
          this.appendProps = Object.fromEntries(targetProps.map(prop => [ prop, {} ] ))
          // this.buildDateObj = this.buildThings(date)
          // this.data = this.getData(date, rawWeatherData.properties)
        }
        buildThings(date) {
          // return {[date]: Object.fromEntries(withTheseProps.map(prop => [ prop, {} ] ))}
        }
        getData(date, rawData) {
          let tmpObj = {}
          for (let [key, val] of Object.entries(rawData)) {
            if (targetProps.includes(key)) {
              tmpObj[key] = val
            }
          }
          return tmpObj
        }
        filteredData (date, rawData) {
          let tmpObj = {}
          for (let [key, val] of Object.entries(rawData)) {
            if (targetProps.includes(key)) {
              // TODO find a way to group data as we iterate over it
              let valsByDate = val.values.filter(value => moment(removePHP(value)).utc().format('YYYY-MM-DD') === date )
              tmpObj[key] = valsByDate
            }
          }
          return tmpObj
        }
      }
      // const today = new DateWeather('2019-12-23')
      // console.log('today', today)

      function buildMasterObj () {
        let props = new PropBuilder()
        let masterObj = {}

        generateArrayOfDates(5).forEach((date) => {
          masterObj[date] = props.appendProps
        })
        return masterObj
      }

      let masterObj = buildMasterObj()

      console.log('masterObj', masterObj)

      // class Thing {
      //   constructor() {
      //     // this.props = Object.fromEntries(withTheseProps)
      //     this.y = 3.14;
      //   }
      //   f(aString) {
      //     console.log('f ran!', aString)
      //   }
      //   g() {}
      // }
      // const o = new Thing();

      // Build base object first

      // TODO Working copy
      // let strippedWeatherData = {}
      // for (let [key, val] of Object.entries(rawWeatherData.properties)) {
      //   if (targetedProps.includes(key)) {
      //     strippedWeatherData[key] = val
      //   }
      //
      // }
      //
      // let dateObj = {}
      // dates.forEach((date) => {
      //   let categoryObj = {}
      //   for (let [key, val] of Object.entries(strippedWeatherData)) {
      //     let valsByDate = val.values.filter(value => moment(removePHP(value)).utc().format('YYYY-MM-DD') === date )
      //     categoryObj[key] = valsByDate
      //     count += 1
      //   }
      //   dateObj[date] = categoryObj
      // })
      // console.log('dateObj after date: ', dateObj)
    },
    getTestData() {
      let t0 = performance.now()

      // this.finalWeatherData = this.processWeatherData(testData, this.withTheseProps)
      this.finalWeatherData = this.processWeatherData2(testData, this.withTheseProps)

      let t1 = performance.now();
      console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate.');
    },
    getWeatherData() {
      weatherGovAPI
        .get(`/points/${this.test_loc_details.geo.lat},${this.test_loc_details.geo.lng}`)
        .then(res => {
          weatherGovAPI
            .get(res.data.properties.forecastGridData)
            .then(res => {
              this.finalWeatherData = this.processWeatherData(res.data)
              // TODO remove php date interval
            })
        })

    },
    getUserLoc () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.user_lat = position.coords.latitude
          this.user_lng = position.coords.longitude
        })
      }
    },
  }
}
</script>

<style scoped>

</style>
