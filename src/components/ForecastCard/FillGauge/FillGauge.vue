<template>
  <v-row no-gutters >
    <v-col cols="1">
      <v-icon color="blue" size="">wi-raindrops</v-icon>
    </v-col>
    <v-col cols="10" class="">
      <div class="progress-bar pl-1 pr-1">
        <div class="progress-amount blue" :style="{width: value + '%'}"></div>
        <span class="text-offset">{{ value }}%</span>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FillGauge',
  components: {},
  props: {
    value: Number
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {

  }
}
</script>

<style scoped>
  .progress-bar {
    height:20px;
    border: 3px solid darkgrey;
    background-color: lightgray;
    border-radius: 10px;
  }
  .progress-amount {
    height: 11px;
    border-radius: 10px;
    margin-top:.09em
  }

  .text-offset {
    display:block;
    margin-top:-1.1em;
    font-size:.85em;
  }
</style>
