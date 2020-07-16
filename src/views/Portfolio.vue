<template>
  <div>
    <v-img height="80vh" src="@/assets/images/portfolio/portfolio-bg.png">
      <v-row class="align-end justify-end fill-height">
        <v-col class="align-end justify-end text-right pa-4 mr-2" :class="{'text-center': isMobile }">
          <span class="text-h2 amber--text text--darken-2" >Matthew Esterberg</span>
          <br/>
          <span class="text-sm-h6 text-lg-h4 text-uppercase">Front-End Developer</span>
        </v-col>
      </v-row>
    </v-img>

    <!-- Who I am -->
    <v-container class="container py-5 px-0 container--fluid">
      <v-img class="abstract-1" contain src="@/assets/images/portfolio/grey-triangle-l.png" />

      <section id="who-i-am" class="row pa-5 mx-0 pos-rel c-grey-text">
        <v-col cols="12">
          <span class="display-2 amber--text text--darken-2">
            Who I am.
          </span>
        </v-col>
        <v-col cols="12" xl="3" lg="4" md="6" sm="6" xs="12">
          <p>
            Devoted on & off the clock developer who has architected and deployed web-apps aimed at weather forecasting,
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
    </v-container>

    <!-- Credentials & Training -->
    <v-container class="container py-5 px-0 container--fluid pos-rel">
      <v-img class="abstract-2" contain src="@/assets/images/portfolio/grey-triangle-r.png" />

      <section id="credentials-and-training" class="row pa-5 mx-0 mt-10 pos-rel justify-space-around">
        <v-list shaped dense two-line class="col-12 col-sm-10 col-md-3 transparent">
          <v-subheader class="display-2 amber--text text--darken-2 mb-2">Credentials</v-subheader>

          <v-divider class="mb-4"/>

          <!-- Credentials -->
          <v-list-item v-for="(cred, ind) in credentials" :key="ind">
            <v-list-item-content >

              <v-list-item-title class="blue--text text--lighten-2 font-weight-bold ">
                {{ cred.title }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ cred.date }}
              </v-list-item-subtitle>

            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- Training -->
        <v-list shaped dense two-line class="col-12 col-sm-10 col-md-3 transparent">
          <v-subheader class="display-2 amber--text text--darken-2 mb-2">Courses</v-subheader>

          <v-divider class="mb-4"/>

          <v-list-item v-for="(course, ind) in courses" :key="ind">
            <v-list-item-content >

              <v-list-item-title class="blue--text text--lighten-2 font-weight-bold ">
                {{ course.title }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ course.date }}
              </v-list-item-subtitle>

            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- Skills -->
        <v-sheet class="pa-1 col-12 col-sm-10 col-md-3 transparent">
          <span class="v-subheader display-2 amber--text text--darken-2 mb-1 pl-0 ">Skills </span>

          <v-divider class="mb-4"/>

          <v-chip outlined v-for="(skill, i) in skills" :key="i"
                  class="mr-2 mb-1">
            <v-icon size="15" left :color="skill.color">
              {{ skill.icon }}
            </v-icon>
            <span class="c-grey-text"> {{ skill.name }}</span>
          </v-chip>
        </v-sheet>
      </section>
    </v-container>

    <!-- Where I've been -->
    <v-container class="container py-5 px-0 container--fluid">
      <v-img class="abstract-3" contain src="@/assets/images/portfolio/grey-triangle-m.png" />

      <section id="where-ive-been" class="row pa-5 mx-0 pos-rel mt-10">
        <v-col cols="12" class="text-center">
          <span class="display-2 amber--text text--darken-2">
            Where I've been
          </span>
        </v-col>

        <v-col cols="12">
          <v-timeline :dense="isMobile">
            <v-timeline-item large color="#343536"
              v-for="(position, i) in positions" :key="i">

              <template v-slot:opposite>
                <span class="subtitle-2">
                  {{ position.year }}
                </span>
              </template>

              <template v-slot:icon>
                <span class="subtitle-2 font-weight-bold" :class="position.text_color">
                  {{ position.company }}
                </span>
              </template>

              <v-card class="elevation-2 c-border-a transparent">

                <!-- Mobile Only! -->
                <span class="caption px-1" v-if="isMobile">
                  {{ position.year }}
                </span>

                <v-card-title class="pb-2" :class="{ 'py-1 !important': isMobile }">
                  <span class="amber--text text--darken-2"> {{ position.title }} </span>
                </v-card-title>

                <v-card-text>
                  <v-chip outlined small v-for="(tech, i) in position.tech" :key="i"
                           class="mr-1 mb-1">
                    <v-icon size="15" left :color="tech.color">
                      {{ tech.icon }}
                    </v-icon>
                    <span class="c-grey-text">
                      {{ tech.name }}
                    </span>
                  </v-chip>
                  <p class="blue--text text--lighten-2 font-weight-bold mt-3 mb-1"> {{ position.highlight }} </p>
                  <span class=""> {{ position.details }} </span>
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
      credentials() {
        return this.$store.state.credentials
      },
      courses() {
        return this.$store.state.courses
      },
      skills() {
        return this.$store.state.skills
      },
      positions() {
        return this.$store.state.positions
      },
      isMobile() {
        return this.$vuetify.breakpoint.mobile
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

>>>.theme--dark.v-chip {
  border: 2px solid #343536;
}

>>> .v-list--two-line .v-list-item, .v-list-item--two-line {
  min-height: 0;
}
.pos-rel {
  position: relative;
}

.abstract-1 {
  position:absolute !important;
  z-index: 0 !important;
}
.abstract-2 {
  position: absolute !important;
  right: 0;
  top: -128px;
  z-index: 0 !important;
}
.abstract-3 {
  position: absolute !important;
  left: 0;
  right: 0;
  z-index: 0 !important;
}
</style>
