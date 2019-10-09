<template>
  <v-container>
    <v-layout row pa-0 align-center justify-center>
      <v-flex shrink>
        <v-icon color="blue" size="">wi-raindrops</v-icon>
      </v-flex>
      <v-flex>
        <div class="progress-bar pl-1 pr-1">
          <div class="progress-amount blue" :style="{width: value + '%'}"></div>
          <span class="text-offset">{{ value }}%</span>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
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
    margin-top:.15em
  }

  .text-offset {
    display:block;
    margin-top:-1.1em;
    font-size:.85em;
  }
</style>
