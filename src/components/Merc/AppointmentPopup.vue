<template>
  <v-sheet class="transparent white--text rounded-lg">
    <v-row no-gutters>
      <h1> {{  clientName }} </h1>

      <p class="caption my-0 py-0">
        {{ address }}
      </p>

    </v-row>

    <MercCardActionButtons
      :appointment="featureInPopup"
      :appointmentStatus="featureInPopup.status"
    />

    <v-row no-gutters class="">
      <v-expansion-panels>
        <v-expansion-panel
          class="transparent elevation-0"
        >
          <v-expansion-panel-header class="pa-0 ma-0 mt-2 "/>

          <v-expansion-panel-content>
            details...
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>


  </v-sheet>
</template>

<script>
import MercCardActionButtons from '@/components/Merc/MercCardActionButtons'
export default {
  name: 'AppointmentPopup',
  props: {
    featureInPopup: Object,
    name: String
  },
  components: { MercCardActionButtons },
  data() {
    return {
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
    },
    clientName() {
      return this.featureInPopup?.properties?.client_info?.name
    }
  },
  watch: {},
  methods: {}
}
</script>

<style scoped>
>>>.v-expansion-panel-header {
  min-height: 15px !important;
}
>>>.v-expansion-panel::before {
  box-shadow: none !important;
}
</style>
