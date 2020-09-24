<template>
  <v-card class="col-6">
    <v-img
      src="@/assets/images/card-placeholder.jpg" />


    <v-card-title> {{ appointment.appointment_location.name }} {{ appointment.appointment_location.locality }}, {{ appointment.appointment_location.administrative_area_level_1 }} {{ appointment.appointment_location.postal_code}} </v-card-title>

    <v-card-text>
      Date: {{ dayjs(appointment.date_time).format ('MMM DD, YYYY') }} <br>
      Time: {{ dayjs(appointment.date_time).format ('h:mm A') }}
    </v-card-text>

    <v-card-actions>
      <v-btn text>Claim</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: 'MercCard',
  props: {
    appointment: Object
  },
  components: {},
  data() {
    return {
      //
    }
  },
  created() {
    console.log('this.appointment', this.appointment)
  },
  destroyed() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style scoped>

</style>
