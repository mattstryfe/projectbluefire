<template>
  <v-card class="pa-2">
    <v-list-item>
      <v-list-item-content>
        <div class="overline mb-4">{{ date | convertToDay }} | Hazard Icons: </div>
        <v-list-item-title class="headline text-center">
          <span
            v-if="data.maxTemperature.values[0]">
            {{ Math.floor(data.maxTemperature.values[0].value * 1.8 + 32) }}° |
          </span>
            <span v-if="data.minTemperature.values[0]">
            {{ Math.floor(data.minTemperature.values[0].value * 1.8 + 32) }}°
          </span>
        </v-list-item-title>

      </v-list-item-content>
    </v-list-item>

    <v-list-item class="text-center">
      <v-col cols="12">
        <v-icon color="grey lighten-2" class="wi weather-icon mt-4 " size="6vw"> {{ determineWeatherIcon(data) }} </v-icon>
      </v-col>
    </v-list-item>

    <v-list-item class="pa-1">
      <v-col cols="6">
        <v-icon color="green" size="55" class="mr-1">wi-raindrop</v-icon>
        {{ calcPrecipTotal(data.quantitativePrecipitation.values) }}
      </v-col>
      <v-col cols="6">
        <v-icon color="blue" size="55" class="mr-1">wi-snowflake-cold</v-icon>
        {{ calcPrecipTotal(data.snowfallAmount.values) }}
      </v-col>
    </v-list-item>

    <v-list-item class="mt-1 pa-0">
      <FillGauge :value="calcPrecipChance(data.probabilityOfPrecipitation)"/>
    </v-list-item>

    <v-list-item class="mt-1 pa-0">
      <FillGauge :value="calcPrecipChance(data.probabilityOfPrecipitation)"/>
    </v-list-item>

  </v-card>
</template>

<script>
import dayjs from 'dayjs'
import FillGauge from './FillGauge/FillGauge'
import '@/assets/weatherIcons/css/weather-icons.css'

export default {
  name: 'ForecastCard',
  components: { FillGauge },
  props: {
    date: String,
    data: Object
  },
  filters: {
    convertToDay: function (date) {
      return dayjs(date).format('ddd')
    }
  },
  data () {
    return {}
  },
  // uncomment as necessary to code stuff
  // created() {},
  // mounted() {},
  // destroyed() {},
  computed: {

  },
  watch: {},
  methods: {
    calcPrecipChance: function (probabilityOfPrecipitation) {
      let probability = []
      for (let i = 0; i < probabilityOfPrecipitation.values.length; i++)
        probability.push(probabilityOfPrecipitation.values[i].value)
      return Math.max(...probability)
    },
    calcPrecipTotal: function (precip) {
      let precipTotal = 0
      if (precip.length > 0) {
        for (let i = 0; i < precip.length; i++)
          precipTotal += precip[i].value
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

        console.log('precipTotal', precipTotal)
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
