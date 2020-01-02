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

    <!-- CARDs -->
    <v-row class="mt-5">
      <v-col
        v-for="(data, date) in finalWeatherData"
        :key="date">
        <ForecastCard :data="data" :date="date"/>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
// Services
import {weatherGovAPI, googleGeoLocAPI} from '@/services/SWFServices'
import dayjs from 'dayjs'
import { testData } from "../assets/data/testData";
import ForecastCard from "../components/ForecastCard/ForecastCard";

export default {
  name: "SWF",
  props: {},
  components: {ForecastCard},
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
        'maxTemperature',
        'minTemperature',
        'probabilityOfPrecipitation',
        'quantitativePrecipitation',
        // 'relativeHumidity',
        'skyCover',
        'snowfallAmount',
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

      // ------ Helper Functions --- //
      function generateArrayOfDates(duration) {
        let dateArr = []
        let today = dayjs()

        for (let i=0; i <= duration; i++)
          dateArr.push(today.add(i, 'days').format('YYYY-MM-DD'))

        return dateArr
      }

      function removePHP(val) {
        // const newVal = val.validTime.split('/')
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
        // console.log('fixedWeatherData', fixedWeatherData )
        weatherPropEntries.values.map(entry => groupByDate(entry, weatherPropKey, weatherPropEntries))

        // This works but forEach's are ugly //
        // weatherPropEntries.values.forEach((entry) => {
        //   let entryDate = moment(entry.validTime).utc().format('YYYY-MM-DD')
        //   if (masterObj.hasOwnProperty(entryDate))
        //     masterObj[entryDate][weatherPropKeys].values.push(entry)
        // })
      }
      function groupByDate(entry, weatherPropKey, weatherPropEntries) {
        // TODO investigate ways to eliminate this from running many times.
        let entryDate = dayjs(entry.validTime).format('YYYY-MM-DD')

        if (masterObj.hasOwnProperty(entryDate)) {
          masterObj[entryDate][weatherPropKey].values.push(entry)
          masterObj[entryDate][weatherPropKey].sourceUnit = weatherPropEntries.sourceUnit
        }
      }
      return masterObj
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
      console.log('finalWeatherData', this.finalWeatherData)

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
              this.finalWeatherData = this.processWeatherData2(res.data, this.withTheseProps)
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
