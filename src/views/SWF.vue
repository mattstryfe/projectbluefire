<template>
  <v-container fluid>

    <v-row class="align-center">
      <v-col cols="1">
        <v-text-field
          v-model="zipcode"
          label="Enter zipcode"
          placeholder="12345"
        />
      </v-col>

      <v-col cols="10" >
        <v-btn
          color="secondary"
          small
          :disabled="!this.zipcode"
          @click="getLiveWeather()"
        >
          Get Live Weather
        </v-btn>

        <v-btn
          class="ml-3"
          color="secondary"
          small
          @click="getTestData()"
        >
          get Test Data
        </v-btn>

        <v-btn
          class="ml-3"
          color="secondary"
          small
          @click="getWeatherAlerts()"
        >
          Get Weather Alerts
        </v-btn>

      </v-col>

    </v-row>

    <!-- Geo Info -->
    <v-row align="center" justify="center">
      {{ user_lat }}, {{ user_lng }}
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
      googleClientKey: process.env.VUE_APP_GOOGLE_CLIENT_KEY,
      zipcode: 20120,
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
        // 'temperature',
        // 'windDirection',
        // 'windSpeed',
        // 'windChill'
      ]
    }
  },
  created() {
    this.getUserLoc()
  },
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    async getLiveWeather() {
      let geoLoc
      try {
        geoLoc = await this.zipToGeo()
      } catch (e) { console.log('e') }

      return this.getWeatherDataUsing(geoLoc)
    },
    processWeatherData(rawWeatherData, targetProps) {
      console.log('rawWeatherData', rawWeatherData)

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
    getWeatherDataUsing(geoLoc) {
      let lat = geoLoc.geometry.location.lat
      let lng = geoLoc.geometry.location.lng

      return weatherGovAPI
        .get(`/points/${lat},${lng}`)
        .then(res => {
          weatherGovAPI
            .get(res.data.properties.forecastGridData)
            .then(res => {
              this.finalWeatherData = this.processWeatherData(res.data, this.withTheseProps)
            })
        })
    },
    zipToGeo(){
      return googleGeoLocAPI
        .get(`${this.zipcode}`, { params:  { key: this.googleClientKey } })
        .then((res) => {
          console.log('zipToGeo res', res)
          return res.data.results[0]
        })
    },
    getWeatherAlerts() {
      return weatherGovAPI
        .get(`/alerts/active?status=actual&message_type=alert&area=ID`)
        .then(res => {
          console.log('getWeatherAlerts res', res)
        })
    },
    getTestData() {
      this.finalWeatherData = this.processWeatherData(testData, this.withTheseProps)
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
