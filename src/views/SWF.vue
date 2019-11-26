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
  data: () => ({
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
    }
  }),
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
    dates() {
      const forecastLength = 5
      let dates = []
      let today = moment()

      for (let i=0; i <= forecastLength; i++) {
        dates.push(today.clone().add(i, 'days').utc().format('YYYY-MM-DD'))
      }
      return dates
    },
    processWeatherData(rawWeatherData) {
      console.log('rawWeatherData', rawWeatherData)
      function removePHP(val) {
        const newVal = val.validTime.split('/')
        val.validTime = newVal[0]
      }

      let processedWeatherData= {}
      const targetedProps = [
        'apparentTemperature',
        'dewpoint',
        'hazards',
        'heatIndex',
        'maxTemperature',
        'minTemperature',
        'relativeHumidity',
        'skyCover',
        // 'snowfallAmount',
        // 'temperature,',
        // 'windDirection',
        // 'windSpeed',
        // 'windChill'
      ]

      for (let date of this.dates()) {
        let propsArray = []
        for (let prop of targetedProps) {
          propsArray.push( { [prop] : rawWeatherData.properties[prop].values.filter(value => moment(removePHP(value)).utc().format('YYYY-MM-DD') === date ) } )
        }
        processedWeatherData[date] = propsArray
      }

      return processedWeatherData
    },
    getTestData() {
      this.finalWeatherData = this.processWeatherData(testData)
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
