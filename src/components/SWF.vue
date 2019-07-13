<template>
  <v-container grid-list-md>
    <v-layout row align-center justify-center>
      <v-flex>
        <h1>{{ title }}</h1>
      </v-flex>
    </v-layout>

    <v-layout row align-center justify-center>
      <v-flex xs1>
        <v-text-field
          v-on:keyup.enter="resolveLocation()"
          label="Zipcode"
          placeholder="ex: 20170"
          v-model="userZip"
          required
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row align-center justify-left>
      <h2 v-show="finalWeatherData !== null">{{ finalWeatherData.formatted_address }}</h2>
    </v-layout>

    <v-layout row  mt-4 mb-4 justify-space-around>
      <ForecastCard
        ma-4
        v-for="(today, date) in finalWeatherData.daily"
        :key="date"
        :date="date"
        :today="today"
      >
      </ForecastCard>

    </v-layout>

    <v-layout column>
      <v-flex xs2 pa-2 class="text-sm-left">
        <!-- Weather Response in JSON Tree -->
        <tree-view :data="finalWeatherData" :options="{maxDepth: 2}"></tree-view>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import moment from 'moment'
import ForecastCard from './forecastCard/ForecastCard'
// Services
import {weatherGovAPI, googleGeoLocAPI} from '@/services/SWFServices'

export default {
  name: 'SWF',
  drawerToggle: false,
  components: {
    ForecastCard
  },
  data () {
    return {
      userZip: '',
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
        'temperature',
        'probabilityOfPrecipitation',
        'quantitativePrecipitation',
        'dewpoint',
        'maxTemperature',
        'minTemperature',
        'snowfallAmount',
        'weather',
        'skyCover',
        'iceAccumulation'
      ],
      googleAPIKey: process.env.google_api_key
    }
  },
  props: ['zip'],
  created: function () {
    this.getUserLoc()
  },
  destroyed: function () {},
  mounted: function () {},
  computed: {},
  watch: {
    finalWeatherData: function (newVal) {
    }
  },
  methods: {
    getUserLoc: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.userCoords = position
        })
      } else {
        console.log('geolocation is not supported')
      }
    },
    resolveLocation () {
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
            console.log('google api response', res)
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
    processData (weatherData) {
      let targetedWeatherData = {}

      for (let targetPropVal of this.valuesToPull) {
        // copy specific target object data to parsedWeatherData
        targetedWeatherData[targetPropVal] = Object.assign({}, weatherData.data.properties[targetPropVal])

        // const reducer = (accumulator, currentValue, currentIndex, array) => currentValue.validTime.substring(0, currentValue.validTime.indexOf('+'));
        // const reduced = targetedWeatherData[targetPropVal].values.reduce(reducer)

        // this strips all the ISO8601 php duration timestamp nonsense from the validTime values
        for (let target of targetedWeatherData[targetPropVal].values) {
          let newTime = target.validTime.substring(0, target.validTime.indexOf('+'))
          // write new time back to object
          target.validTime = newTime
        }
      }

      return targetedWeatherData
    },
    prepData (processedWeatherData) {
      let dailyForecast = {}
      const forecastLength = 5
      const today = moment().utc()
      const dateArr = []
      // create an array of dates starting with now.
      // use forecast length to determine how many to make.
      for (let i = 0; i < forecastLength; i++) {
        // push UTC to array
        // must use clone because moment mutates the original
        let date = today.clone().add(i, 'days').utc().format('YYYY-MM-DD')

        // push date to array for processing purposes.
        // this is strictly to make stepping through each date easier.
        dateArr.push(date)

        // append date to dailyForecast Object
        dailyForecast[date] = dailyForecast[date]

        // Force it to be an object because shut up!
        dailyForecast[date] = {}

        // for each valueToPull append the category to the object
        this.valuesToPull.forEach((category) => {
          // make sure it knows category is an array
          dailyForecast[date][category] = []
        })
      }

      console.log('dailyForecast', dailyForecast)

      // Turn weather.gov's 'categorically grouped data' into 'date grouped data'.
      // Settings contains an array of values to pull from the forecast.
      // For each one, get the dateArr and establish a day.
      // Once a [category] and [day] are established, start stripping the shitty weather.gov
      // response into usable information.
      // Push each array to the corresponding day.category.
      // ex: 2017-11-23.dewpoint[validTime: 'time', value: '4]

      this.valuesToPull.forEach((category) => {
        dateArr.forEach((day) => {
          processedWeatherData[category].values.forEach((element) => {
            if (element.validTime.includes(day)) {
              dailyForecast[day][category].push(element)
            }
          })
        })
      })

      // Append daily forecast data to object
      this.finalWeatherData.daily = dailyForecast

      // Vue specific command
      // must reinstantiate the object to trigger changes in the v-for
      // Deep copy of object solves the detection caveats
      this.finalWeatherData = Object.assign({}, this.finalWeatherData)
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
