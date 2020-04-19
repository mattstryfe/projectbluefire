<template>
  <v-container>

    <v-row class="text-center mb-5">
      <v-col>
        <h1>Project Bluefire</h1>
        <span>{{ missionStatement }}</span>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row class="justify-space-around mt-5">
      <v-col v-if="page.title !== 'Home'"
             cols="4" v-for="page in pages"
             :key="page.title"
             class="text-center">
        <v-card flat hover
          color="transparent"
          class="pa-2"
          :to="page.href"
        >
          <v-icon size="8vw" :color="page.color" >
            {{ page.icon}}
          </v-icon>
          <v-card-text class="title font-weight-bold">
            {{ page.title }}
          </v-card-text>
          <v-card-text class=" pt-0">
            {{ page.desc }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>



  </v-container>
</template>

<script>
  export default {
    name: 'home',
    components: {},
    props: {},
    data () {
      return {
        missionStatement: 'An attempt to improve everything; beginning with weather.',
      }
    },

    computed:{
      pages () {
        return this.$store.state.pages
      }
    }
  }
</script>

<style scoped>
</style>
