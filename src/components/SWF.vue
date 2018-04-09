<template>
  <div class="hello">
    <h1>{{ title }}</h1>

    <!-- Enter Zipcode here -->
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs2>
          <v-form>
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
  }
</script>

<style scoped>

</style>
