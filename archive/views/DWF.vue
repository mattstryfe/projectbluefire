<template>
  <v-container fluid class="pt-0">
    <RecentLocations />
    <v-col cols="3" class="ma-0 pa-1 mt-1">
      <v-form
        ref="form"
        v-model="isValidZipcode"
        @submit.prevent
        @keyup.native.enter="getForecastFor(zipcode)"
      >
        <v-text-field
          dense
          outlined
          label="Enter zipcode"
          v-model="zipcode"
          :rules="zipcodeRules"
          placeholder=" "
        >
          <template v-slot:append>
            <v-icon
              color="green"
              :disabled="!isValidZipcode"
              @click="getForecastFor(zipcode)"
            >
              fa-bullseye
            </v-icon>
          </template>
        </v-text-field>
      </v-form>
    </v-col>

    <v-row no-gutters>
      {{ formatted_address }}
    </v-row>

    <!-- Legacy Cards -->
    <v-row>
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
import RecentLocations from '@/components/DWF/RecentLocations'
import ForecastCard from '@/components/ForecastCard/ForecastCard'
import {
  checkDbFor,
  geoToGrid,
  gridToForecast,
  processWeatherData
} from '@/services/SharedServices'
export default {
  name: 'DWF',
  props: {},
  components: { ForecastCard, RecentLocations },
  data() {
    return {
      finalWeatherData: null,
      formatted_address: null,
      isValidZipcode: false,
      zipcode: '',
      zipcodeRules: [
        (zip) => zip.length === 5 || 'zipcode not valid',
        (zip) => !!zip || 'Zipcode required!',
        (zip) => /^[0-9]*$/.test(zip) || 'zipcode must only be numbers'
      ],
      weatherPropertiesToTarget: [
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
        'windSpeed'
        // 'windChill'
      ]
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    recentLocationToUse() {
      return this.$store.state.recentLocationToUse
    }
  },
  watch: {
    recentLocationToUse(newVal) {
      if (newVal) {
        this.zipcode = newVal.zipcode
      }
    }
  },
  methods: {
    async getForecastFor(zip) {
      // Check to see if 'zipcode' exists in database
      // fires off side query to get data from google if not
      // RETURNS geoData
      const {
        geometry: {
          location: { lat, lng }
        },
        grid_props,
        formatted_address
      } = await checkDbFor(zip)

      this.formatted_address = formatted_address

      // grid_props exists if the entry already exists in the DB
      // this saves another query
      const grid = grid_props ? grid_props : await geoToGrid(lat, lng, zip)

      // Get actual forecast
      const forecast = await gridToForecast(grid)

      // Process forecast
      this.finalWeatherData = await processWeatherData(
        forecast.data,
        this.weatherPropertiesToTarget
      )
    }
  }
}
</script>

<style scoped></style>
