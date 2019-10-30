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
    </v-row>
    <v-row>
      {{ raw_weather.properties }}
    </v-row>
  </v-container>
</template>

<script>
// Services
import {weatherGovAPI, googleGeoLocAPI} from '@/services/SWFServices'
import moment from 'moment'

export default {
  name: "SWF",
  props: {},
  components: {},
  data: () => ({
    user_lat: null,
    user_lng: null,
    raw_weather: null,
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
  },
  destroyed() {
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
    processWeatherData(rawWeatherData) {

      let date = '2019-10-29T20:00:00+00:00/PT22H'
      let date2 = moment.parseZone(date).utc().format()

      const allowed = ['waveHeight', 'visibility']

      const filtered = Object.keys(rawWeatherData.properties)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = rawWeatherData.properties[key];
          return obj;
        }, []);

      console.log('filtered', filtered)

      // console.log('object.values:', Object.values(rawWeatherData.properties))

      // for (let keys in rawWeatherData.properties) {
      //   if (allowed.includes(keys)) {
      //     console.log('object.values:', Object.values())
      //     console.log('keys', keys)
      //   }
      // }
    },
    getWeatherData() {
      weatherGovAPI
        .get(`/points/${this.test_loc_details.geo.lat},${this.test_loc_details.geo.lng}`)
        .then(res => {
          weatherGovAPI
            .get(res.data.properties.forecastGridData)
            .then(res => {
              console.log('raw forecast', res)
              this.raw_weather = res.data
              this.processWeatherData(res.data)
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
