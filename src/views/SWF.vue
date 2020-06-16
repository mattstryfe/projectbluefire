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

          <v-col>
            <span class="heading-2">
              {{ formatted_address }}
            </span>
          </v-col>

        </v-row>
      </v-container>
    </v-form>

    <!-- Geo Info -->
    <v-row align="center" justify="center">
    </v-row>

    <!-- Current Location -->
    <v-alert type="info" dense dismissible class="text-center" :value="currentLocationAlert">Using your current location {{ user_lat}}, {{ user_lng}}</v-alert>

    <!-- Alerts -->
    <v-row v-if="alertsByGeo" class="mt-1">
      <v-alert type="warning" desnse dismissible
               v-for="alert in alertsByGeo.data.features"
               :key="alert.id"
               >
        <h4> {{ alert.properties.event }} : </h4>
        <span class="subtitle-2"> {{ alert.properties.description }} </span>
      </v-alert>
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
import {
  geoToGrid,
  gridToForecast,
  checkDbFor,
  getAlertsByState,
  getAlertsByCount,
  getAlertsByGeo
} from '../services/SWFServices'

export default {
  name: "SWF",
  props: {},
  components: { ForecastCard },
  data () {
    return {
      alertsByGeo: null,
      msg: null,
      overallProgress: 0,
      currentLocationAlert: false,
      formatted_address: '',
      zipcode: process.env.NODE_ENV === 'development' ? '16033' : '',
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
    await this.useUserLoc()
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


      // Check Database for existing zipcode...
      // Exists ? skip google API Query / return database vals : run google API Query / return vals
      const {
        geometry: { location: { lat, lng }},
        formatted_address,
        grid_props,
        address_components
      } = await checkDbFor(this.zipcode)

      this.formatted_address = formatted_address
      this.overallProgress = 10
      this.msg = 'got zip!'

      // Get alert information
      // May not have to be async...
      this.alertsByState = await getAlertsByState(address_components)
      console.log('this.alertsByState', this.alertsByState)

      this.alertsByCount = await getAlertsByCount()
      console.log('getAlertsCount', this.alertsByCount)

      this.alertsByGeo = await getAlertsByGeo(lat, lng)
      console.log('alertsByGeo', this.alertsByGeo)

      // Check grid_props for existing grid URL
      // Exists ? skip weather.gov API query / return grid URL : run weather.gov API Query / return URL
      const grid = (grid_props) ? grid_props : await geoToGrid(lat, lng, this.zipcode)
      this.overallProgress = 50
      this.msg = 'grid acquired!'


      // Get actual forecast
      const forecast = await gridToForecast(grid)
      this.overallProgress = 75
      this.msg = 'processing forecast...'


      // Process forecast
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
        // If allowed, get user coords via browser
        const { lat, lng } = await this.$getLocation()
        this.currentLocationAlert = true
        this.overallProgress = 10
        this.msg = 'no zip, using browser coords...'

        // Populate these for the DOM
        this.user_lat = lat
        this.user_lng = lng

        // Since we're not hitting the Database, go directly to getting grid URL
        const grid = await geoToGrid(lat, lng, false)
        this.overallProgress = 50
        this.msg = 'grid acquired!'

        // Get actual forecast
        const forecast = await gridToForecast(grid)
        this.overallProgress = 75
        this.msg = 'processing forecast...'

        // Process forecast
        this.finalWeatherData = this.processWeatherData(forecast.data, this.withTheseProps)
        this.overallProgress = 100
        this.msg = 'Done!'
    }
      catch (err) {
      console.log('err',err)}
    }
  }
}

</script>

<style scoped>
.cust-loader {
  transition: all 0.5s;
}
</style>
