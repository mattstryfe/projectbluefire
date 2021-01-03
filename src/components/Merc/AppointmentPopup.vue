<template>
  <div>
    <h1> Appointment Popup</h1>
    <span> name: {{ name }}</span>
  </div>
</template>

<script>
export default {
  name: 'AppointmentPopup',
  props: {
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
  mounted() {
    console.log('mounted!')
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style scoped>

</style>
