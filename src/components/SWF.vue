<template>
  <div class="hello">
    <h1>{{ title }}</h1>

    <!-- Enter Zipcode here -->
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs2>
          <v-form @submit="resolveLocation()">
            <v-text-field
              label="Zipcode"
              placeholder="ex: 20170"
              v-model="userZip"
              required
            ></v-text-field>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
    <span>zipcode: {{ this.locDetails }}</span>
  </div>
</template>

<script>
  import * as Vue from 'vue-resource'

  export default {
    name: 'SWF',
		drawerToggle: false,
    data: () => ({
      userZip: '',
      title: 'Simple Weather Forecast (SWF)',
      locDetails: '',
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
              this.processData(res);
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
        console.log('targetedWeatherData', targetedWeatherData)

        // assign targetedWeatherData to trimmedData.trimmedData.
        // This must be passed via the ng-click in swf.html
        // trimmedData.trimmedData = targetedWeatherData
      },
      prepData (settings, processedWeatherData, finalWeatherData) {
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
          settings.valuesToPull.forEach((category) => {
            // make sure it knows category is an array
            dailyForecast[date][category] = [];
          });
          //console.log('dailyForecast', dailyForecast)
        }

        // Turn weather.gov's 'categorically grouped data' into 'date grouped data'.
        // Settings contains an array of values to pull from the forecast.
        // For each one, get the dateArr and establish a day.
        // Once a [category] and [day] are established, start stripping the shitty weather.gov
        // response into usable information.
        // Push each array to the corresdonding day.category.
        // ex: 2017-11-23.dewpoint[validTime: 'time', value: '4]
        settings.valuesToPull.forEach((category) => {
          dateArr.forEach((day) => {
            processedWeatherData.trimmedData[category].values.forEach((element) => {
              //console.log('all elements: ', element)
              if (element.validTime.includes(day)) {
                dailyForecast[day][category].push(element)
              }
            });
          })
        })

        // working copy using angular.forEach incase needed later.
        /*angular.forEach(settings.valuesToPull, (category) => {
          angular.forEach(dateArr, (day) => {
            angular.forEach(processedWeatherData.trimmedData[category].values, (element) => {
              if(element.validTime.includes(day)) {
                                dailyForecast[day][category].push(element)
              }
            });
                    });
        });*/

        // assign dailyForecast to finalWeatherData.finalWeatherData.
        // This must be passed via the ng-click in swf.html
        finalWeatherData.finalWeatherData = dailyForecast
      },
    }
}
</script>

<style scoped>

</style>
