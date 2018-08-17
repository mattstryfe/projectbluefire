<template>
  <div class="hello">
    <h1>{{ title }}</h1>

    <!-- Enter Zipcode here -->
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs2 style="padding:4px;">
          <v-card>
            <v-form @submit="resolveLocation()">
              <v-text-field
                label="Zipcode"
                placeholder="ex: 20170"
                v-model="userZip"
                required
              ></v-text-field>
            </v-form>
          </v-card>

          <div class="text-sm-left">
            <tree-view :data="finalWeatherData" :options="{maxDepth: 2}"></tree-view>
          </div>

        </v-flex>

        <v-flex v-for="(i, index) in finalWeatherData" xs2 align-content-start>
          <!--<span>zipcode: {{ this.locDetails.city }}</span>-->
          <h4>{{ index }}</h4>

        </v-flex>
      </v-layout>
    </v-container>



  </div>
</template>

<script>
  import * as Vue from 'vue-resource';
  import moment from 'moment';

  export default {
    name: 'SWF',
		drawerToggle: false,
    data: () => ({
      userZip: '',
      title: 'Simple Weather Forecast (SWF)',
      locDetails: '',
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
    }),
		props:['zip'],
		created: function () {
			// `this` points to the vm instance
			console.log('zip ', this.zip)
		},
    methods: {
      resolveLocation () {
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
          const locDetails = {
            geo : {
              lat: res.body.results[0].geometry.location.lat,
              lng: res.body.results[0].geometry.location.lng
            },
        	  zipcode: res.body.results[0].address_components[0].short_name,
            city: res.body.results[0].address_components[1].short_name,
            county: res.body.results[0].address_components[2].short_name,
            state: res.body.results[0].address_components[3].short_name,
            country: res.body.results[0].address_components[4].short_name,
          }

          // make available to app
          this.locDetails = locDetails;

          // build wGov link
          config.wGov.fullUrl = config.wGov.baseUrl + locDetails.geo.lat + ',' + locDetails.geo.lng

          return this.$http.get(config.wGov.fullUrl, config);
        }).then(function(WgovResponse) {
            config.wGov.gridUrl = WgovResponse.body.properties.forecastGridData;
            this.$http.get(config.wGov.gridUrl, config).then (res => {
              console.log('final wGov res', res);
              let processedData = this.processData(res);
              this.prepData(processedData);
            })
          })
      },
      processData (weatherData) {
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
        for (let i=0; i < forecastLength; i++) {

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
        this.finalWeatherData = dailyForecast;
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
