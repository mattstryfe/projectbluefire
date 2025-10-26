<template>
  <v-container fluid>
    <v-form ref="form" v-model="isValidZipcode" @submit.prevent @keyup.native.enter="getLiveWeather()">
      <v-container fluid>
        <v-row>
          <v-col xl="1" lg="2" md="3" sm="3" xs="3" class="pb-0">
            <v-text-field solo single-line loading
              v-model="zipcode"
              :rules="zipcodeRules"
              label="Enter zipcode"
              class="c-border-a"
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

    <!-- Current Location -->
    <v-alert outlined dense dismissible text
      type="info"
      border="left"
      class="text-center mb-0"
      :value="currentLocationAlert"
    >
      <span v-if="currentLocationAlert" class="caption">
        Using current location... {{ trimmedLat }}, {{ trimmedLng }}
      </span>
    </v-alert>

    <!-- Alerts -->
    <v-row v-if="alertsByGeo" class=" ma-1">
      <v-alert
          type="warning" desnse dismissible
          v-for="alert in alertsByGeo.data.features"
          :key="alert.id"
        >
        <h4> {{ alert.properties.event }} : </h4>
        <span class="subtitle-2">
          {{ alert.properties.description }}
        </span>
      </v-alert>
    </v-row>

    <!-- CARDs -->
    <v-row class="">
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
import ForecastCard from "../components/ForecastCard/ForecastCard.vue";
import {
  getAlertsByGeo,
  processWeatherData,
  geoToGrid,
  gridToForecast,
  checkDbFor
} from '@/services/SharedServices'

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
    trimmedLat() {
      return this.userLoc.lat.toFixed(2)
    },
    trimmedLng() {
      return this.userLoc.lng.toFixed(2)
    },
    color () {
      return ['error', 'warning', 'success'][Math.floor(this.overallProgress / 40)]
    },
    userLoc: {
      get() {
        return this.$store.state.userLoc
      },
      set(newVal) {
        this.$store.commit("updateUserLoc", newVal);
      }
    }
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
        grid_props
      } = await checkDbFor(this.zipcode)

      this.formatted_address = formatted_address
      this.overallProgress = 10
      this.msg = 'got zip!'

      // Get alert information
      // May not have to be async...
      // this.alertsByState = await getAlertsByState(address_components)
      //
      // this.alertsByCount = await getAlertsByCount()

      // Auto writes to state via setter
      this.userLoc = {lat, lng}

      this.alertsByGeo = await getAlertsByGeo(lat, lng)

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
      this.finalWeatherData = await processWeatherData(forecast.data, this.withTheseProps)
      this.overallProgress = 100
      this.msg = 'Done!'
    },
    async useUserLoc() {
      try {
        // If allowed, get user coords via browser
        const { lat, lng } = await this.$getLocation()
        this.currentLocationAlert = true
        this.overallProgress = 10
        this.msg = 'no zip, using browser coords...'

        // Populate these for the DOM
        // Auto writes to state via setter
        this.userLoc = {lat, lng}

        // Since we're not hitting the Database, go directly to getting grid URL
        const grid = await geoToGrid(lat, lng, false)
        this.overallProgress = 50
        this.msg = 'grid acquired!'

        // Get actual forecast
        const forecast = await gridToForecast(grid)
        // todo, if this fails subtract 1 from gridY and try again...
        this.overallProgress = 75
        this.msg = 'processing forecast...'

        // Process forecast
        this.finalWeatherData = await processWeatherData(forecast.data, this.withTheseProps)
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

</style>
