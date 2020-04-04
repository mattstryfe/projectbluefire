<template>
  <v-col md="3" xl="2">
    <v-card class="pa-2">
      <v-list-item>
        <v-list-item-content>
          <div class="overline mb-4">{{ day }} | Hazard Icons: </div>
          <v-list-item-title class="headline text-center">
            <span :class="determineColor(highTemp)"
              v-if="data.maxTemperature.values[0]">
              {{ highTemp }}°
            </span>
            |
            <span :class="determineColor (lowTemp)"
              v-if="data.minTemperature.values[0]">
              {{ lowTemp }}°
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Primary ICON -->
      <v-list-item class="text-center">
        <v-col cols="12">
          <v-icon color="grey lighten-2" class="wi weather-icon mt-4 " size="6vw"> {{ determineWeatherIcon(data) }} </v-icon>
        </v-col>
      </v-list-item>

      <!-- ICONS -->
      <v-list-item class="pa-1 text-center">
        <v-col cols="4">
          <v-icon color="green" size="3vw" class="mr-1">wi-raindrop</v-icon> <br />
          {{ calcRainTotal(data.quantitativePrecipitation.values) }}
        </v-col>
        <v-col cols="4">
          <v-icon color="blue" size="3vw" class="mr-1">wi-snowflake-cold</v-icon><br />
          {{ calcSnowTotal(data.snowfallAmount.values) }}
        </v-col>
        <v-col cols="4">
          <v-icon color="white" size="3vw" class="mr-1">wi-strong-wind</v-icon><br />
          {{ getHighWindSpeedFrom(data.windSpeed) }}
        </v-col>
      </v-list-item>

      <!-- Gauges -->
      <v-list-item class="mt-1 pa-0">
        <FillGauge :value="calcPrecipChance(data.probabilityOfPrecipitation)"/>
      </v-list-item>

    </v-card>
  </v-col>
</template>

<script>
import FillGauge from './FillGauge/FillGauge'
import '@/assets/weatherIcons/css/weather-icons.css'

export default {
  name: 'ForecastCard',
  components: { FillGauge },
  props: {
    date: String,
    data: Object
  },
  data () {
    return {
      //
    }
  },
  // uncomment as necessary to code stuff
  // created() {},
  // mounted() {},
  // destroyed() {},
  computed: {
    day() {
      return this.dayjs(this.date).format('ddd')
    },
    lowTemp() {
      return Math.floor(this.data.minTemperature.values[0].value * 1.8 + 32)
    },
    highTemp() {
      return Math.floor(this.data.maxTemperature.values[0].value * 1.8 + 32)
    }
  },
  watch: {},
  methods: {
    determineColor: function (temp) {
      switch (true) {
        case (temp <= 0):
          return 'blue--text darken-3'
        case (temp > 0 && temp <= 32):
          return 'light-blue--text'
        case (temp > 32 && temp <= 55):
          return 'green--text lighten-1'
        case (temp > 55 && temp <= 75):
          return  'yellow--text darken-3'
        case (temp > 75 && temp <= 90):
          return 'orange--text darken-3'
        case (temp > 90):
          return 'red--text accent-4'
      }
    },
    calcPrecipChance: function (probabilityOfPrecipitation) {
      let probability = []
      for (let i = 0; i < probabilityOfPrecipitation.values.length; i++)
        probability.push(probabilityOfPrecipitation.values[i].value)
      return Math.max(...probability)
    },
    calcSnowTotal: function (snow) {
      let snowTotal = 0
      if (snow.length > 0) {
        for (let i = 0; i < snow.length; i++)
          snowTotal += snow[i].value
        return (snowTotal * 0.039370).toFixed(2)
      } else {
        return snowTotal
      }
    },
    calcRainTotal: function (precip) {
      let precipTotal = 0
      if (precip.length > 0) {
        for (let i = 0; i < precip.length; i++)
          precipTotal += precip[i].value
        return (precipTotal * 0.039370).toFixed(2)
      } else {
        return precipTotal
      }
    },
    getHighWindSpeedFrom: function (cardWindSpeeds) {
      let highWind = []
      for (let i = 0; i< cardWindSpeeds.values.length; i++)
        highWind.push(cardWindSpeeds.values[i].value)
      return Math.floor(Math.max(...highWind) * 1.15)

    },
    // Take in the value of the weather day object to determine icon
    // Determine weather icon in order...  Once one is determined this function exits
    // Order of operations //
    // Snow > Rain > Clouds
    determineWeatherIcon: function (val) {
      //TODO look to weather value in main json weather response!
      // set base vars
      let precipTotal = 0
      let skyCover = 0
      let snowFallTotal = 0


      // is it snowing??
      if (val.snowfallAmount.values.length > 0) {
        for (let i = 0; i < val.snowfallAmount.values.length; i++)
          snowFallTotal += val.snowfallAmount.values[i].value

        snowFallTotal = snowFallTotal / val.snowfallAmount.values.length

        if (snowFallTotal > 0) {
          return 'wi-day-snow'
        }
      }

      // is it raining?
      if (val.quantitativePrecipitation.values.length > 0) {
        for (let i = 0; i < val.quantitativePrecipitation.values.length; i++)
          precipTotal += val.quantitativePrecipitation.values[i].value

        precipTotal = precipTotal / val.quantitativePrecipitation.values.length * 0.39370

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
      if (val.skyCover.values.length > 0) {
        for (let i = 0; i < val.skyCover.values.length; i++)
          skyCover += val.skyCover.values[i].value

        skyCover = skyCover / val.skyCover.values.length

        switch (true) {
          case (skyCover < 20):
            return 'wi-day-sunny'
          case (skyCover < 50):
            return 'wi-day-cloudy'
          case (skyCover > 50):
            return 'wi-cloudy'
        }
      }
    }
  }
}
</script>

<style scoped>
/* Override for v-list item spacing */
.v-list-item {
  min-height: auto !important;
}
.weather-box {
  border: 1px solid #eee;
}
.weather-icon {
  /*font-size: 5vw;*/
  /*margin: 20px 0px;*/
}
</style>
