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

      <v-layout row align-center justify-left>
        <h2 v-if="finalWeatherData !== null">{{ finalWeatherData.formatted_address }}</h2>
      </v-layout>



      <v-layout row mt-4 mb-4 justify-space-around>
        <!-- Daily Forecast cards -->
        <v-flex xs2 ma-2
          class="weather-box"
          v-for="(val, key) in finalWeatherData.daily"
          :key="key"
        >
          <h4 class="day-header">{{ convertToDay(key) }}</h4>
          <span v-if="val.maxTemperature[0]">{{ Math.floor(val.maxTemperature[0].value * 1.8 + 32) }}° | </span>
          <span v-if="val.minTemperature[0]">{{ Math.floor(val.minTemperature[0].value * 1.8 + 32) }}° </span>
          <br />
          <i v-bind:class="determineWeatherIcon(val)" class="wi weather-icon"></i>

        </v-flex>
      </v-layout>


      <v-layout column>
        <v-flex xs2 style="padding:4px;">
          <!-- Weather Response in JSON Tree -->
          <div class="text-sm-left" v-if="progress !== 0">
            <tree-view :data="finalWeatherData" :options="{maxDepth: 2}"></tree-view>
          </div>

        </v-flex>

        <v-layout row>
          <v-flex xs4>
            <v-card>
              <input v-model="twitterFilter" placeholder="filter tweets here">
            </v-card>
          </v-flex>
        </v-layout>

        <!-- Map -->
        <v-flex d-flex xs12>
          <MainMap
            :userCoords="userCoords"
            :finalWeatherData="finalWeatherData"
            :landAlertData="landAlertData"
            :marineAlertData="marineAlertData"
            :affectedByAlerts="affectedByAlerts"
            :staticLandAlerts="this.staticLandAlerts"
            :randomGeoJson="randomGeoJson"
            :twitterFeedData="twitterFeedData"
          >

          </MainMap>
        </v-flex>
      </v-layout>

    </v-container>
  </div>
</template>

<script>
  import MainMap from './map/MainMap'
  import moment from 'moment';
  import staticLandAlerts from '../../static/weatherAlerts-9oct2018.json';
  import io from 'socket.io-client';
  import debounce from 'debounce';

  export default {
    name: 'SWF',
    drawerToggle: false,
    components: {
      MainMap
    },
    data () {
      return {
        socket : io('localhost:3000'),
        staticLandAlerts: staticLandAlerts,
        userZip: '',
        userCoords: {},
        title: 'Simple Weather Forecast (SWF)',
        locDetails: null,
        progress: 0,
        finalWeatherData: {},
        randomGeoJson: {},
        twitterFilter: '',
        twitterFeedData: [],
        twitterFeedDataSave: [],
        landUrl: 'https://api.weather.gov/alerts/active?status=actual',
        marineUrl: 'https://api.weather.gov/alerts/active/region/AT',
        // marineUrl: 'https://api.weather.gov/alerts?region_type=marine',
        searchWithinUrl: 'http://localhost:3000/searchwithin',
        randomDataUrl: 'http://localhost:3000/random',
        headers: {
          'Content-type': 'application/geo+json',
          'Accept': 'application/geo+json',
          'Access-Control-Allow-Origin': '*',
          'UserAgent': 'Project Bluefire'
        },
        landAlertData: {},
        marineAlertData: {},
        affectedByAlerts: {},
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
        ]
      }
    },
    props: ['zip'],
    created: function () {
     this.getUserLoc()
    },
    destroyed: function () {
      this.socket.disconnect();
    },
    mounted: function () {
      this.getTwitterFeed();

      Promise.all([
        this.getLandAlerts(),
        this.getMarineAlerts(),
        this.getRandomData()
      ]).then(res => {
        // this.determineAffectedAssets(res[0])

        let scrubbedStaticAlertData = this.scrubStaticLandAlerts(this.staticLandAlerts)
        this.determineAffectedAssets(scrubbedStaticAlertData)
      })
    },
    computed: {
    },
    watch: {
      twitterFilter: debounce(function () {
        console.log('twitterFilter:', this.twitterFilter)
        // this.socket.disconnect();

        this.socket.emit('twitterFilter', this.twitterFilter)

        this.socket.connect()
      }, 500)
    },
    methods: {
      // Take in the value of the weather day object to determine
      // which icon to display.  This method determines this by...
      determineWeatherIcon: function (val) {
        console.log('val', val)

        let precipTotal = 0;
        let skyCover = 0;

        //is it raining?
        if (val.quantitativePrecipitation.length > 0) {
          console.log('in here', val.quantitativePrecipitation.length)
          for(let i=0; i++; i < val.quantitativePrecipitation.length) {
            console.log( val.quantitativePrecipitation[i].value)
            precipTotal += val.quantitativePrecipitation[i].value
          }
        }

        if (val.skyCover.length > 0) {
          for(let i=0; i++; i < val.skyCover.length) {
            skyCover += val.skyCover[i].value
          }
        }

        console.log('precipTotal', precipTotal)
        console.log('skyCover', skyCover)
        // switch(val)
        return 'wi-day-sunny'
      },
      convertToDay: function (date) {
        return moment(date).format('ddd')
      },
      getTwitterFeed() {
        const vm = this
        //this.socket.on('connect', function() {
          // this.socket.emit('twitterFilter', this.twitterFilter )
        // })
        this.socket.on('twitter feed', function (data) {
          if (data.place !== null && data.place.bounding_box !== null) {
            if (vm.twitterFeedDataSave.length > 99) {
              vm.twitterFeedDataSave = [];
            }
            console.log('vm.twitterFeedData', vm.twitterFeedData)
            vm.twitterFeedDataSave.push(data)
            vm.twitterFeedData = data
          }
        });
      },
      scrubStaticLandAlerts: function (dataToScrub) {
        let scrubbedData = dataToScrub.features.filter((el) => {
          return el.geometry !== null && typeof el.geometry !== 'undefined';
        });
        return scrubbedData;
      },
      getRandomData: function() {
        return this.$http.post(this.randomDataUrl, { randomCount: 50 }).then(res => {
          this.randomGeoJson = res.body.randomGeoJson;
          /*this.alertDataMarine = res.body.features.filter((el) => {
            return el.geometry !== null && typeof el.geometry !== 'undefined';
          });*/

          return this.randomGeoJson;
        })
      },
    	getLandAlerts: function() {
				return this.$http.get(this.landUrl, this.headers).then(res => {
					this.landAlertData = res.body.features.filter((el) => {
            return el.geometry !== null && typeof el.geometry !== 'undefined';
          });
          return this.landAlertData;
				})
      },
      getMarineAlerts: function() {
        return this.$http.get(this.marineUrl, this.headers).then(res => {
          this.marineAlertData = res.body;
          /*this.alertDataMarine = res.body.features.filter((el) => {
            return el.geometry !== null && typeof el.geometry !== 'undefined';
          });*/

          return this.marineAlertData;
        })
      },
      determineAffectedAssets(searchWithin) {
        // const assets = [[64.6, 67.9], [64.6, 67.9], [64.6, 67.9], [32.4487, -99.7331], [30.4382559, -84.2807329]]
        this.$http.post(this.searchWithinUrl, {assets: this.randomGeoJson.features, searchWithin: searchWithin}).then(res => {
          this.affectedByAlerts = res.body;
          return this.affectedByAlerts;
        })
      },
      getUserLoc: function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.userCoords = position
          })
        }
        else {
          console.log('geolocation is not supported')
        }
      },
      calcPrecip(obj) {
      },
      resolveLocation () {
        this.progress = 20;
        const apiKey = 'AIzaSyDxPB3EAVaAWH29EUBmoCtLAnSdRrnE1UI'
        const config = {
          geoLocUrl: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.userZip + '&key=' + apiKey,
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
        // Push each array to the corresponding day.category.
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
  .weather-box {
    border: 1px solid #eee;
  }
  .weather-icon {
    font-size: 5vw;
    margin: 20px 0px;
  }
  .day-header {
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }
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
