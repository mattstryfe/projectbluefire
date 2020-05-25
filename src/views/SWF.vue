<template>
  <v-container fluid>
    <v-form ref="form" v-model="isValidZipcode" @submit.prevent @keyup.native.enter="getLiveWeather()">
      <v-container fluid>
        <v-row class="align-center">
          <v-col cols="3">
            <v-text-field
              v-model="zipcode"
              :rules="zipcodeRules"
              label="Enter zipcode"
              :append-outer-icon="isValidZipcode ? 'fa-bullseye' : 'fa-ban'"
              @click:append-outer="getLiveWeather()"
            />
          </v-col>

          <v-spacer/>
        </v-row>
      </v-container>
    </v-form>

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
import ForecastCard from "../components/ForecastCard/ForecastCard";
import { geoToGrid, gridToForecast, checkDbFor } from '../services/SWFServices'

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
    this.useUserLoc()

  },
  destroyed() {},
  mounted() {},
  computed: {},
  methods: {
    async getLiveWeather() {
      if (!this.isValidZipcode)
        return
      // Clear data/cards
      this.finalWeatherData = null
      this.formatted_address = null
      this.currentLocationAlert = false

      // const geoData = await checkDbFor(this.zipcode)
      const { geometry: { location: { lat, lng }}, formatted_address, grid_props } = await checkDbFor(this.zipcode)
      this.formatted_address = formatted_address

      // use geo, get grid
      // determine if entry exists already.  If so, skip geoToGrid and return the vals
      const grid = (grid_props) ? grid_props : await geoToGrid(lat, lng, this.zipcode)

      // use grid, get forecast
      const forecast = await gridToForecast(grid)

      // process forecast data into usable things...
      this.finalWeatherData = this.processWeatherData(forecast.data, this.withTheseProps)
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
    async useUserLoc() {
      try {
        let coordinates = await this.$getLocation()
        this.currentLocationAlert = true

        // Build out this data so it matches what's returned by google.
        // This allows us to reuse geoToGrid()
        this.user_lat = coordinates.lat
        this.user_lng = coordinates.lng

        const grid = await geoToGrid(coordinates.lat, coordinates.lng, false)
        const forecast = await gridToForecast(grid)

        // process forecast data into usable things...
        this.finalWeatherData = this.processWeatherData(forecast.data, this.withTheseProps)
    }
      catch (err) {
      console.log('err',err)}
    }
  }

}

</script>

<style scoped>

</style>
