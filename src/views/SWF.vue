<template>
  <v-container fluid>
    <v-row class="align-center">
      <v-col>
        <v-form ref="form" v-model="isValidZipcode" @submit.prevent @keyup.native.enter="getLiveWeather()">
          <v-text-field
            v-model="zipcode"
            :rules="zipcodeRules"
            label="Enter zipcode"
          />
        </v-form>
      </v-col>

      <v-col cols="12" >
        <v-btn @click="getLiveWeather()" small class="ml-3 " color="secondary" :disabled="!isValidZipcode">
          Get Live Weather
        </v-btn>

        <v-btn @click="getLiveAlerts()" small class="ml-3" color="secondary">
          Get Alert Data
        </v-btn>

        <v-btn @click="getTestData()" small class="ml-3" color="secondary">
          Get Test Data
        </v-btn>
      </v-col>

    </v-row>

    <!-- Geo Info -->
    <v-row align="center" justify="center">
      {{ formatted_address }}
    </v-row>

    <!-- Alerts -->
    <v-alert type="info" dense dismissible class="text-center" :value="currentLocationAlert">Using your current location {{ user_lat}}, {{ user_lng}}</v-alert>

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
import { testData } from "../assets/data/testData";
import ForecastCard from "../components/ForecastCard/ForecastCard";
import { geoToGrid, getWeatherAlerts, gridToForecast, zipToGeo, currentLocToGrid } from '../services/SWFServices'

export default {
  name: "SWF",
  props: {},
  components: { ForecastCard },
  data () {
    return {
      currentLocationAlert: false,
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
  async created() {
    if ((await navigator.permissions.query({name: 'geolocation'})).state === 'granted') {
      this.useUserLoc()
      this.currentLocationAlert = true
    } else {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }
  },
  destroyed() {},
  mounted() {},
  computed: {},
  methods: {
    async getLiveAlerts() {
      // use zip, get geo
      const geoLoc = await zipToGeo(this.zipcode)

      const alerts = await getWeatherAlerts(geoLoc)
      console.log('getWeatherAlerts:', alerts)
    },
    async getLiveWeather() {
      // Clear data/cards
      this.finalWeatherData = null
      this.formatted_address = null
      this.currentLocationAlert = false


      // use zip, get geo
      const geoData = await zipToGeo(this.zipcode)
      this.formatted_address = geoData.formatted_address


      // use geo, get grid
      const grid = await geoToGrid(geoData)

      // use grid, get forecast
      const forecast = await gridToForecast(grid)

      // process forecast data into usable things...
      this.finalWeatherData = this.processWeatherData(forecast.data, this.withTheseProps)

      // get weather alerts for state
      const alerts = await getWeatherAlerts(geoData)
      console.log('getWeatherAlerts:', alerts)
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
    getTestData() {
      this.finalWeatherData = this.processWeatherData(testData, this.withTheseProps)
    },
    async getCoordinates() {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    },
    async useUserLoc() {
      const autoCoords = await this.getCoordinates()
      const gridCurLoc = await currentLocToGrid(
        this.user_lat= autoCoords.coords.latitude,
        this.user_lng= autoCoords.coords.longitude)
      const forecastCurLoc = await gridToForecast(gridCurLoc)
      // process forecast data into usable things...
      this.finalWeatherData = this.processWeatherData(forecastCurLoc.data, this.withTheseProps)


    }
  }

}

</script>

<style scoped>

</style>
