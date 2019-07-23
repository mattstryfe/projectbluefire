<template>
  <v-flex xs4 ma4>
    <v-card >
      <v-card-title>{{ date | convertToDay }}</v-card-title>
      <span v-if="today.maxTemperature[0]">{{ Math.floor(today.maxTemperature[0].value * 1.8 + 32) }}° | </span>
      <span v-if="today.minTemperature[0]">{{ Math.floor(today.minTemperature[0].value * 1.8 + 32) }}° </span>
      <br />
      <i :class="determineWeatherIcon(today)" class="wi weather-icon"></i>
      <br />
      <span>Rain: {{ calcPrecipTotal(today.quantitativePrecipitation) }} in</span>
      <br />
      <span>Snow: {{ calcPrecipTotal(today.snowfallAmount) }} in</span>

<!--      <v-card-text>-->
      <v-container>
        <v-layout row pa-0 align-center justify-center>
          <v-flex shrink>
            <v-icon color="blue" size="">wi-raindrops</v-icon>
          </v-flex>
          <v-flex grow>
            <div class="progress-bar pl-1 pr-1">
              <div class="progress-amount blue" :style="{width: probabilityOfPrecip + '%'}"></div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>


<!--      </v-card-text>-->

    </v-card>
  </v-flex>
</template>

<script>
import moment from 'moment'

export default {
  name: 'searchBar',
  components: {},
  props: {
    date: String,
    today: Object
  },
  filters: {
    convertToDay: function (date) {
      return moment(date).format('ddd')
    }
  },
  data () {
    return {
      probabilityOfPrecip: 50
    }
  },
  // uncomment as necessary to code stuffz
  // created() {},
  // mounted() {},
  // destroyed() {},
  computed: {

  },
  watch: {},
  methods: {
    calcPrecipTotal: function (precip) {
      let precipTotal = 0
      if (precip.length > 0) {
        for (let i = 0; i < precip.length; i++) {
          precipTotal += precip[i].value
        }
        return (precipTotal / precip.length * 0.039370).toFixed(2)
      } else {
        return precipTotal
      }
    },
    // Take in the value of the weather day object to determine icon
    // Determine weather icon in order...  Once one is determined this function exits
    // Order of operations //
    // Snow > Rain > Clouds
    determineWeatherIcon: function (val) {
      // set base vars
      let precipTotal = 0
      let skyCover = 0
      let snowFallTotal = 0

      // is it snowing??
      if (val.snowfallAmount.length > 0) {
        for (let i = 0; i < val.snowfallAmount.length; i++) {
          snowFallTotal += val.snowfallAmount[i].value
        }
        snowFallTotal = snowFallTotal / val.snowfallAmount.length

        if (snowFallTotal > 0) {
          return 'wi-day-snow'
        }
      }

      // is it raining?
      if (val.quantitativePrecipitation.length > 0) {
        for (let i = 0; i < val.quantitativePrecipitation.length; i++) {
          precipTotal += val.quantitativePrecipitation[i].value
        }
        precipTotal = precipTotal / val.quantitativePrecipitation.length * 0.39370

        switch (true) {
          case (precipTotal === 0):
            break
          case (precipTotal < 0.25):
            return 'wi-day-sprinkle'
          case (precipTotal < 0.5):
            return 'wi-day-showers'
          case (precipTotal > 0.5):
            return 'wi-day-rain'
        }
      }

      // is it cloudy?
      if (val.skyCover.length > 0) {
        for (let i = 0; i < val.skyCover.length; i++) {
          skyCover += val.skyCover[i].value
        }
        skyCover = skyCover / val.skyCover.length

        switch (true) {
          case (skyCover < 0.2):
            return 'wi-day-sunny'
          case (skyCover < 0.5):
            return 'wi-day-cloudy'
          case (skyCover > 0.5):
            return 'wi-cloudy'
        }
      }
    }
  }
}
</script>

<style scoped>
  .progress-bar {
    height:20px;
    border: 3px solid darkgrey;
    background-color: lightgray;
    border-radius: 10px;
  }
  .progress-amount {
    height: 11px;
    border-radius: 10px;
    margin-top:.15em
  }
  .weather-box {
    border: 1px solid #eee;
  }
  .weather-icon {
    font-size: 5vw;
    margin: 20px 0px;
  }
</style>
