<template>
  <div>
    <v-img height="80vh" src="@/assets/images/portfolio/portfolio-bg.png">
      <v-row class="align-end justify-end fill-height">
        <v-col class="align-end justify-end text-right pa-4">
          <span class="text-h2 text-lg-h2 amber--text text--darken-2">Matthew Esterberg</span>
          <br/>
          <span class="text-h4 text-lg-h1 text-h4-xs text-uppercase">Front-End Developer</span>
        </v-col>
      </v-row>
    </v-img>

    <v-container class="container py-5 px-0 container--fluid">
      <v-img class="abstract-1" contain src="@/assets/images/portfolio/grey-triangle-l.png" />

      <section id="who-i-am" class="row pa-5 mx-0 pos-rel">
        <v-col cols="12">
          <span class="display-2 amber--text text--darken-2">
            Who I am.
          </span>
        </v-col>
        <v-col cols="12" xl="3" lg="4" md="6" sm="6" xs="12">
          <p class="">
            Devoted off-the-clock developer who has developed and deployed web-apps aimed at weather forecasting,
            harnessing geospatial trend mapping, and home automation/information gathering.
            Their purpose, aside from learning tools, is to slowly improve various quality of life areas.
          </p>

          <p class="text-h5">Project <span class="blue--text text--lighten-2 mr-1">Bluefire</span>
            <span class="subtitle-1">is one such app.</span>
          </p>
        </v-col>

        <v-col cols="12" xl="3" lg="4" md="6" xs="12" class="ml-auto">
          <p><span class="amber--text text--darken-2">Location:</span> Earth</p>
          <p><span class="amber--text text--darken-2">Email:</span> Yes.</p>
          <p><span class="amber--text text--darken-2">Phone:</span> Yes.</p>
          <p><span class="amber--text text--darken-2">Discord:</span> @mattstryfe2161</p>

        </v-col>
      </section>
    </v-container>


  </div>
</template>

<script>
  export default {
    name: 'Portfolio',
    props: {},
    components: {},
    data () {
      return {

      }
    },
    created() {},
    destroyed() {},
    mounted() {},
    computed: {},
    watch: {},
    methods: {}
  }
</script>

<style scoped>
.pos-rel {
  position: relative;
}
.abstract-1 {
  position:absolute !important;
  z-index: 0 !important;
}
</style>
