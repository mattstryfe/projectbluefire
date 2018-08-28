<template>
  <div class="hello">
    <v-container grid-list-md>
      <v-layout row align-center justify-center>
        <v-flex>
          <h1>{{ title }}</h1>
        </v-flex>
      </v-layout>

      <v-layout row align-center justify-center>
        <v-flex xs1>
          <!-- Zipcode Submit form/card -->
          <!-- Enter Zipcode here -->
          <v-form @submit="resolveLocation()">
            <v-text-field
              label="Zipcode"
              placeholder="ex: 20170"
              v-model="userZip"
              required
            ></v-text-field>
          </v-form>
        </v-flex>

        <v-flex xs1>
          <!-- Loading Bar/Circle -->
          <v-progress-circular
            :rotate="-90"
            :size="50"
            :width="5"
            :value="progress"
            color="primary"
            v-if="progress !== 0"
          >
            {{ progress }}
          </v-progress-circular>
        </v-flex>
      </v-layout>

      <v-layout row align-center justify-center>
        <span v-if="finalWeatherData !== null">{{ finalWeatherData.formatted_address }}</span>
      </v-layout>



      <v-layout row>
        <!-- Daily Forecast cards -->
        <v-flex xs6 justify-space-around ma-2 v-for="(val, key) in finalWeatherData.daily" :key="key">
          <v-card>
            <v-card-title>{{ key }}</v-card-title>
            <v-card-text>{{ Math.floor(val.maxTemperature[0].value * 1.8 + 32) }}</v-card-text>
            <v-card-text v-if="typeof val.minTemperature[0] !== 'undefined'"> {{ Math.floor(val.minTemperature[0].value * 1.8 + 32) }}</v-card-text>
            <v-card-text>{{ calcPrecip(val.quantitativePrecipitation) }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout column>
        <!-- Map -->
        <v-flex d-flex xs12>
          <MainMap :finalWeatherData="finalWeatherData">

          </MainMap>
        </v-flex>

        <v-flex xs2 style="padding:4px;">
          <!-- Weather Response in JSON Tree -->
          <div class="text-sm-left" v-if="progress !== 0">
            <tree-view :data="finalWeatherData" :options="{maxDepth: 2}"></tree-view>
          </div>

        </v-flex>
      </v-layout>

    </v-container>



  </div>
</template>

<script>
  import MainMap from './map/MainMap'
  import moment from 'moment';

  export default {
    name: 'SWF',
    drawerToggle: false,
    components: {
      MainMap
    },
    data () {
      return {
        userZip: '',
        title: 'Simple Weather Forecast (SWF)',
        locDetails: null,
        progress: 0,
        finalWeatherData: {},
        valuesToPull: [
          'temperature',
          'probabilityOfPrecipitation',
          'quantitativePrecipitation',
          'dewpoint',
          'maxTemperature',
          'minTemperature',
          'snowfallAmount'
        ]
      }
    },
    props: ['zip'],
    created: function () {
    },
    mounted: function () {
    	// once mounted get alerts for US
			this.getWeatherAlerts()

    },
    methods: {
    	getWeatherAlerts: function() {
    		const wGovAlertsUrl = 'https://api.weather.gov/alerts'
				this.$http.get(wGovAlertsUrl).then(res => {
          console.log('features', res.body.features)
				})
      },
      calcPrecip(obj) {
      },
      resolveLocation () {
        this.progress = 20;
        const config = {
          apiKey: 'AIzaSyBoGMPpAjvF8DhxSEeQ80QObwx6ARnoTxE',
          geoLocUrl: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.userZip,
          wGov: {
            baseUrl: 'https://api.weather.gov/points/',
            fullUrl: '',
            gridUrl: ''
          }
        }
        this.$http.get(config.geoLocUrl, config).then(res => {
          console.log('google Res:', res);
          this.progress = 40;
          const locDetails = {
            geo: {
              lat: res.body.results[0].geometry.location.lat,
              lng: res.body.results[0].geometry.location.lng
            },
            zipcode: res.body.results[0].address_components[0].short_name,
            formatted_address: res.body.results[0].formatted_address
          }

          // make available to app
          this.finalWeatherData = locDetails;

          // build wGov link
          config.wGov.fullUrl = config.wGov.baseUrl + locDetails.geo.lat + ',' + locDetails.geo.lng

          return this.$http.get(config.wGov.fullUrl, config);
        }).then(function (WgovResponse) {
          this.progress = 60;
          config.wGov.gridUrl = WgovResponse.body.properties.forecastGridData;
          this.$http.get(config.wGov.gridUrl, config).then(res => {
            this.progress = 80;
            console.log('final wGov res', res);
            this.prepData(this.processData(res));
          })
        })
      },
      processData (weatherData) {
        this.progress = 99;
        let targetedWeatherData = {};

        // assign valuesToPull to new object.
        this.valuesToPull.forEach((targetPropVal, k) => {
          // copy specific target object data to parsedWeatherData
          targetedWeatherData[targetPropVal] = Object.assign({}, weatherData.body.properties[targetPropVal])

          // this strips all the ISO8601 php duration timestamp nonsense from the validTime values
          targetedWeatherData[targetPropVal].values.forEach((v) => {
            let newTime = v.validTime.substring(0, v.validTime.indexOf('+'))
            // write new time back to object
            v.validTime = newTime;
          })
        });

        return targetedWeatherData;
      },
      prepData (processedWeatherData) {
        let dailyForecast = {};
        const forecastLength = 5;
        const today = moment().utc();
        const dateArr = [];
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
            dailyForecast[date][category] = [];
          });
        }

        // Turn weather.gov's 'categorically grouped data' into 'date grouped data'.
        // Settings contains an array of values to pull from the forecast.
        // For each one, get the dateArr and establish a day.
        // Once a [category] and [day] are established, start stripping the shitty weather.gov
        // response into usable information.
        // Push each array to the corresdonding day.category.
        // ex: 2017-11-23.dewpoint[validTime: 'time', value: '4]
        this.valuesToPull.forEach((category) => {
          dateArr.forEach((day) => {
            processedWeatherData[category].values.forEach((element) => {
              //console.log('all elements: ', element)
              if (element.validTime.includes(day)) {
                dailyForecast[day][category].push(element)
              }
            });
          })
        })

        // assign dailyForecast to finalWeatherData.finalWeatherData.
        // This must be passed via the ng-click in swf.html
        // finalWeatherData.finalWeatherData = dailyForecast
        this.finalWeatherData.daily = dailyForecast;
        this.progress = 100;
      },
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
