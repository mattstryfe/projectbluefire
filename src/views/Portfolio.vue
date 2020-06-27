<template>
  <div>
    <v-img height="80vh" src="https://material-portfolio-dark.vuetifyjs.com/img/hero.e530afc6.png">
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
          <span class="display-2 amber--text text--darken-2"> Who I am.</span>
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
