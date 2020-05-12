<template>
  <v-container fluid>
    <v-form ref="form" v-model="isValidZipcode" @submit.prevent @keyup.native.enter="getLiveWeather()">
      <v-container fluid>
        <v-row class="">
          <v-col xl="1" lg="2" md="3" sm="3" xs="3">
            <v-text-field solo single-line loading
              v-model="zipcode"
              :rules="zipcodeRules"
              label="Enter zipcode"
            >
              <template v-slot:prepend-inner>
                <v-icon
                  :color="isValidZipcode ? 'success' : 'error'"
                  @click="getLiveWeather()"> {{ isValidZipcode ? 'fa-crosshairs' : 'fa-ban' }}
                </v-icon>
              </template>

              <template v-slot:progress>
                <v-progress-linear
                  :value="overallProgress"
                  :color="color"
                  absolute
                  height="10"
                  class="cust-loader"
                >
                  <span class="overline">{{ msg }}</span>
                </v-progress-linear>
              </template>
            </v-text-field>
          </v-col>

        </v-row>
      </v-container>
    </v-form>

    <!-- Geo Info -->
    <v-row align="center" justify="center">
      {{ formatted_address }}
    </v-row>

    <!-- Alerts -->
    <v-alert type="info" dense dismissible class="text-center" :value="currentLocationAlert">Using your current location {{ user_lat}}, {{ user_lng}}</v-alert>

    <!-- Loading wheel -->
    <v-row class="mt-5" v-show="overallProgress !== 100">
      <v-spacer/>

      <v-progress-circular
        :rotate="-90"
        :size="500"
        :width="15"
        :value="overallProgress"
        :color="color"
      >
        {{ overallProgress }}
      </v-progress-circular>

      <v-spacer/>
    </v-row>

    <!-- CARDs -->
    <v-row class="mt-5">
      <ForecastCard
        v-for="(data, date) in finalWeatherData"
        :key="date"
        :data="data"
        :date="date"
      />
    </v-row>

  </v-container>
</template>

<script>
// Services
import dayjs from 'dayjs'
import ForecastCard from "../components/ForecastCard/ForecastCard";
import { geoToGrid, gridToForecast, checkDbFor } from '../services/SWFServices'

export default {
  name: "SWF",
  props: {},
  components: { ForecastCard },
  data () {
    return {
      msg: null,
      overallProgress: 0,
      currentLocationAlert: '',
      formatted_address: '',
      zipcode: '16033',
      isValidZipcode: true,
      zipcodeRules: [
        zip => zip.length === 5 || 'zipcode not valid',
        zip => !!zip || 'Zipcode required!',
        zip => /^[0-9]*$/.test(zip) || 'zipcode must only be numbers',

      ],
      user_lat: null,
      user_lng: null,
      raw_weather: null,
      finalWeatherData: null,
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
        //'hazards',
        // 'temperature',
        // 'windDirection',
        'windSpeed',
        // 'windChill'
      ]
    }
  },
  created() {
    this.useUserLoc()
  },
  destroyed() {},
  mounted() {},
  computed: {
    color () {
      return ['error', 'warning', 'success'][Math.floor(this.overallProgress / 40)]
    },
  },
  methods: {
    async getLiveWeather() {
      if (!this.isValidZipcode)
        return
      // Clear data/cards
      this.overallProgress = 0
      this.finalWeatherData = null
      this.formatted_address = null
      this.currentLocationAlert = false

      const geoData = await checkDbFor(this.zipcode)
      this.overallProgress = 10
      this.msg = 'got zip!'
      this.formatted_address = geoData.formatted_address

      // use geo, get grid
      // determine if entry exists already.  If so, skip geoToGrid and return the vals
      const grid = (geoData.grid_props) ? geoData.grid_props : await geoToGrid(geoData, this.zipcode)
      this.overallProgress = 50
      this.msg = 'grid acquired!'

      // use grid, get forecast
      const forecast = await gridToForecast(grid)
      this.overallProgress = 75
      this.msg = 'processing forecast...'

      // process forecast data into usable things...
      this.finalWeatherData = this.processWeatherData(forecast.data, this.withTheseProps)
      this.overallProgress = 100
      this.msg = 'Done!'
    },
    processWeatherData(rawWeatherData, targetProps) {
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
    },
    async getCoordinates() {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
    async useUserLoc() {
      this.overallProgress = 0

      const autoCoords = await this.getCoordinates()
      this.overallProgress = 10
      this.msg = 'got zip!'

      // Build out this data so it matches what's returned by google.
      // This allows us to reuse geoToGrid()
      let geoData = { geometry: { location: { }}}
      geoData.geometry.location.lat = this.user_lat = autoCoords.coords.latitude
      geoData.geometry.location.lng = this.user_lng = autoCoords.coords.longitude

      const grid = await geoToGrid(geoData, false)
      this.overallProgress = 50
      this.msg = 'grid acquired!'

      const forecast = await gridToForecast(grid)
      this.overallProgress = 75
      this.msg = 'processing forecast...'

      // process forecast data into usable things...
      this.finalWeatherData = this.processWeatherData(forecast.data, this.withTheseProps)
      this.msg = 'Done!'
      this.overallProgress = 100
    }
  }
}

</script>

<style scoped>
.cust-loader {
  transition: all 1s;
}
</style>
