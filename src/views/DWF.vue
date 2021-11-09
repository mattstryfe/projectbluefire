<template>
  <v-container fluid class="pt-0">
    <RecentLocations/>
    <v-col cols="3" class="ma-0 pa-1 mt-1">
      <v-form ref="form" v-model="isValidZipcode" @submit.prevent @keyup.native.enter="getLiveWeather()">
        <v-text-field dense outlined
          label="Enter zipcode"
          v-model="zipcode"
          :rules="zipcodeRules"
          placeholder=" "
        >
          <template v-slot:append>
            <v-icon color="green"
              :disabled="!isValidZipcode"
              @click="getForecastFor(zipcode)"
            >
              fa-bullseye
            </v-icon>
          </template>

        </v-text-field>
      </v-form>

    </v-col>

    <v-row>
      <v-col>
        zipcode: {{ zipcode }}
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import RecentLocations from '@/components/DWF/RecentLocations'
import { checkDbFor } from '@/services/DWFServices'
export default {
  name: 'DWF',
  props: {},
  components: {RecentLocations},
  data() {
    return {
      isValidZipcode: false,
      zipcode: '',
      zipcodeRules: [
        zip => zip.length === 5 || 'zipcode not valid',
        zip => !!zip || 'Zipcode required!',
        zip => /^[0-9]*$/.test(zip) || 'zipcode must only be numbers',
      ],
      //
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    recentLocationToUse() {
      return this.$store.state.recentLocationToUse
    }
  },
  watch: {
    recentLocationToUse(newVal) {
      console.log('newVal', newVal)
      if (newVal) {
        this.zipcode = newVal.zipcode
      }
    }
  },
  methods: {
    async getForecastFor(zipcode) {
      // Check to see if 'zipcode' exists in database
      const res = await checkDbFor(zipcode)
      console.log('res', res)
    }
  }
}
</script>

<style scoped>

</style>
