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
    <span>zipcode: {{ userZip }}</span>
  </div>
</template>

<script>
  export default {
    name: 'SWF',
		drawerToggle: false,
    data: () => ({
      userZip: '',
      title: 'Simple Weather Forecast (SWF)',
    }),
		props:['zip'],
		created: function () {
			// `this` points to the vm instance
			console.log('zip ', this.zip)
		},
    methods: {
      resolveLocation () {
      	console.log('userZip', this.userZip)
        Vue.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=', this.userZip).then(response => {
        	this.body = response.body;
        	console.log('response body:', this.body);
        })
      }
    }
  }
</script>

<style scoped>

</style>
