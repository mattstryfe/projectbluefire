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
            console.log('first wGov res', WgovResponse)
            config.wGov.gridUrl = WgovResponse.body.properties.forecastGridData;
            this.$http.get(config.wGov.gridUrl, config).then (res => {
              console.log('final wGov res', res);
            })
          })
      }
    }
  }
</script>

<style scoped>

</style>
