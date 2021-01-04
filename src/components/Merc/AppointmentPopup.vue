<template>
  <v-sheet class="transparent white--text rounded-lg">
    <h1> Appointment </h1>
    <p class="caption my-0 py-0">
      {{ id }}
    </p>

    <p class="caption my-0 py-0">
      {{ address }}
    </p>

    <v-row>
      <v-spacer/>
      <!-- Claim button -->
      <v-btn
        icon
      >
        <v-icon dense class="pa-2">
          far fa-star
        </v-icon>
      </v-btn>

      <!-- Share button -->
      <v-btn icon disabled>
        <v-icon dense class="pa-2">
          fas fa-share-alt
        </v-icon>
      </v-btn>
    </v-row>

  </v-sheet>
</template>

<script>
export default {
  name: 'AppointmentPopup',
  props: {
    featureInPopup: Object,
    name: String
  },
  components: {},
  data() {
    return {
      text: 'appointment'
      //
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    id() {
      // fixes on-load being empty.
      return this.featureInPopup?.properties?.id
    },
    address() {
      return this.featureInPopup?.properties?.appointment_location?.name
    }
  },
  watch: {
    featureInPopup() {
      console.log('changed!', this.featureInPopup.properties)

    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
