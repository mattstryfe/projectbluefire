<template>
  <v-row no-gutters >
    <v-col cols="1">
      <v-icon color="green" size="">wi-raindrops</v-icon>
    </v-col>
    <v-col class="">
      <div class="progress-bar px-1">
        <div class="progress-amount blue" :style="{width: value + '%'}"></div>
        <span class="text-offset pl-1 font-weight-black">{{ value }}%</span>
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
    height: 20px;
    border: 2px solid darkgrey;
    background-color: lightgray;
    border-radius: 10px;
  }
  .progress-amount {
    height: .8em;
    border-radius: 10px;
    margin-top: .12em;
  }

  .text-offset {
    color: #424242;
    display:block;
    margin-top:-1.2em;
    font-size:.75em;
  }
</style>
