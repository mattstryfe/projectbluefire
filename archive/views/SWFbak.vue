<template>
  <v-container fluid>
    <v-row align="center" justify="center">
<!--      {{ user_lat }}, {{ user_lng }}-->
    </v-row>
    <v-row>
      <v-btn
        color="secondary"
        small
        @click="resolveLocation()"
      >
        Get Weather
      </v-btn>

      <v-btn
        class="ml-3"
        color="secondary"
        small
        @click="loadTestData()"
      >
        load test data
      </v-btn>
    </v-row>
    <v-row>
      {{ finalWeatherData}}
    </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'
// Services
import {weatherGovAPI, googleGeoLocAPI} from '@/services/SWFServices'
import { testData } from "../../assets/data/testData";

export default {
  name: 'SWF',
  drawerToggle: false,
  components: {},
  data() {
    return {
      userZip: '',
      raw_weather: null,
      userCoords: Object,
      title: 'Simple Weather Forecast (SWF)',
      locDetails: null,
      finalWeatherData: {},
      landAlertData: {},
      landAlertZonesRaw: [],
      headers: {
        'Content-type': 'application/geo+json',
        'Accept': 'application/geo+json',
        'Access-Control-Allow-Origin': '*',
        'UserAgent': 'Project Bluefire'
      },
      valuesToPull: [
        'apparentTemperature',
        'dewpoint',
        'heatIndex',
        'maxTemperature',
        'minTemperature',
        'relativeHumidity',
        'skyCover',
        'snowfallAmount',
        'temperature'
      ],
      googleAPIKey: process.env.google_api_key
    }
  },
  props: ['zip'],
  created() {
    this.getUserLoc()
  },
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {
    finalWeatherData(newVal) {
    }
  },
  methods: {
    loadTestData() {
      let t0 = performance.now()
      this.finalWeatherData = this.prepData(this.processData(testData))
      let t1 = performance.now();
    },
    getUserLoc() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.userCoords = position
        })
      } else {
      }
    },
    resolveLocation() {
      const locDetails = {
        geo: {
          lat: 38.8629803,
          lng: -77.4816693
        },
        state: 'VA',
        zipcode: '20120',
        formatted_address: 'Sully Station, VA 20120, USA'
      }
      // make available to app
      this.finalWeatherData = locDetails

      weatherGovAPI.get(`/points/${locDetails.geo.lat},${locDetails.geo.lng}`)
        .then(res => {
          weatherGovAPI
            .get(res.data.properties.forecastGridData)
            .then(res => {
              this.prepData(this.processData(res))
            })
        })
        // Get GEO Stuffs from google.
        // This is needed to properly form the wGov URL
        /* googleGeoLocAPI
          .get(`${this.userZip}&key=${this.googleAPIKey}`)
          .then(res => {
            const locDetails = {
              geo: {
                lat: res.data.results[0].geometry.location.lat,
                lng: res.data.results[0].geometry.location.lng
              },
              state: res.data.results[0].address_components[2].short_name,
              zipcode: res.data.results[0].address_components[0].short_name,
              formatted_address: res.data.results[0].formatted_address
            }
          // make available to app
          this.finalWeatherData = locDetails;

          return weatherGovAPI.get(`/points/${locDetails.geo.lat},${locDetails.geo.lng}`)
        }).then(res => {
          weatherGovAPI
            .get(res.data.properties.forecastGridData)
            .then(res => {
              this.prepData(this.processData(res));
            })
        }) */
    },
    processData(weatherData) {
      let targetedWeatherData = {}

      let t0 = performance.now()
      for (let targetPropVal of this.valuesToPull) {
        // copy specific target object data to parsedWeatherData
        // targetedWeatherData[targetPropVal] = Object.assign({}, weatherData.properties[targetPropVal])
        targetedWeatherData[targetPropVal] = weatherData.properties[targetPropVal]

        // this strips all the ISO8601 php duration timestamp nonsense from the validTime values
        for (let target of targetedWeatherData[targetPropVal].values) {
          // write new time back to object
          target.validTime = target.validTime.substring(0, target.validTime.indexOf('+'))
        }
      }
      let t1 = performance.now();
      return targetedWeatherData
    },
    prepData(processedWeatherData) {

      let dailyForecast = {}
      const forecastLength = 5
      const today = dayjs()
      const dateArr = []
      // create an array of dates starting with now.
      // use forecast length to determine how many to make.
      for (let i = 0; i < forecastLength; i++) {
        // push UTC to array
        // must use clone because moment mutates the original
        let date = today.add(i, 'days').format('YYYY-MM-DD')

        // push date to array for processing purposes.
        // this is strictly to make stepping through each date easier.
        dateArr.push(date)

        // append date to dailyForecast Object
        // dailyForecast[date] = dailyForecast[date]

        // Force it to be an object because shut up!
        dailyForecast[date] = {}

        // for each valueToPull append the category to the object
        this.valuesToPull.forEach((category) => {
          // make sure it knows category is an array
          dailyForecast[date][category] = []
        })
      }
      // Turn weather.gov's 'categorically grouped data' into 'date grouped data'.
      // Settings contains an array of values to pull from the forecast.
      // For each one, get the dateArr and establish a day.
      // Once a [category] and [day] are established, start stripping the shitty weather.gov
      // response into usable information.
      // Push each array to the corresponding day.category.
      // ex: 2017-11-23.dewpoint[validTime: 'time', value: '4]

      let buildingNewObj0 = performance.now()
      let count = 0
      this.valuesToPull.forEach((category) => {
        dateArr.forEach((day) => {
          processedWeatherData[category].values.forEach((element) => {
            count += 1
            if (element.validTime.includes(day)) {
              dailyForecast[day][category].push(element)
            }
          })
        })
      })
      let buildingNewObj1 = performance.now()

      // Append daily forecast data to object
      // this.finalWeatherData.daily = dailyForecast

      // Vue specific command
      // must reinstantiate the object to trigger changes in the v-for
      // Deep copy of object solves the detection caveats
      // this.finalWeatherData = Object.assign({}, this.finalWeatherData)
      return dailyForecast
    }
  }
}
</script>

<style scoped>
  /* The Tree View should only fill out available space, scroll when
     necessary.
  */
  .tree-view-item {
    font-family: monospace;
    font-size: 14px;
    margin-left: 18px;
  }

  .tree-view-wrapper {
    overflow: auto;
  }

  /* Find the first nested node and override the indentation */
  .tree-view-item-root > .tree-view-item-leaf > .tree-view-item {
    margin-left: 0;
  }

  /* Root node should not be indented */
  .tree-view-item-root {
    margin-left: 0;
  }

  .tree-view-item-node {
    cursor: pointer;
    position: relative;
    white-space: nowrap;
  }

  .tree-view-item-leaf {
    white-space: nowrap;
  }

  .tree-view-item-key {
    font-weight: bold;
  }

  .tree-view-item-key-with-chevron {
    padding-left: 14px;
  }

  .tree-view-item-key-with-chevron.opened::before {
    top:4px;
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
  }

  .tree-view-item-key-with-chevron::before {
    color: #444;
    content: '\25b6';
    font-size: 10px;
    left: 1px;
    position: absolute;
    top: 3px;
    transition: -webkit-transform .1s ease;
    transition: transform .1s ease;
    transition: transform .1s ease, -webkit-transform .1s ease;
    -webkit-transition: -webkit-transform .1s ease;
  }

  .tree-view-item-hint {
    color: #ccc
  }
</style>
