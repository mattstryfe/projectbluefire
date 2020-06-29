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

      <!-- Who I am -->
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

        <v-spacer />

        <v-col cols="12" xl="3" lg="4" md="4" sm="4" xs="12" class="">
          <p><span class="amber--text text--darken-2">Location:</span> Earth</p>
          <p><span class="amber--text text--darken-2">Email:</span> Yes.</p>
          <p><span class="amber--text text--darken-2">Phone:</span> Yes.</p>
          <p><span class="amber--text text--darken-2">Discord:</span> @mattstryfe2161</p>
        </v-col>
      </section>

      <!-- Where I've been -->
      <section id="where-ive-been" class="row pa-5 mx-0 pos-rel mt-10">
        <v-col cols="12" class=" text-right">
          <span class="display-2 amber--text text--darken-2">
            Where I've been
          </span>
        </v-col>

        <v-col cols="12">
          <v-timeline>
            <v-timeline-item large color="#343536"
              v-for="(position, i) in positions" :key="i">

              <template v-slot:opposite>
                <span class="subtitle-2">{{ position.year }}</span>
              </template>

              <template v-slot:icon>
                <span class="subtitle-2" :class="position.text_color">{{ position.company }}</span>
              </template>

              <v-card class="elevation-2 c-border-a">
                <v-card-title class="headline">
                  <span class="blue--text text--lighten-2 text-caption mx-1"> | </span>
                  <span v-for="(tech, i) in position.tech" :key="i" class="amber--text text--darken-2">
                    {{ tech }}
                    <span class="blue--text text--lighten-2 text-caption mx-1 pt-2">
                    |
                    </span>
                  </span>

                </v-card-title>
                <v-card-text>
                  <span class="blue--text text--lighten-2 font-weight-bold">{{ position.highlight }}</span>
                  {{ position.details }}
                </v-card-text>
              </v-card>
            </v-timeline-item>

          </v-timeline>

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
    computed: {
      positions() {
        return this.$store.state.positions
      }
    },
    watch: {},
    methods: {}
  }
</script>

<style scoped>
>>>.theme--dark.v-timeline .v-timeline-item__dot {
  background: #546E7A
}
.pos-rel {
  position: relative;
}
.abstract-1 {
  position:absolute !important;
  z-index: 0 !important;
}
</style>
