<template>
  <v-app id="inspire">

    <side-bar :drawer="drawer"></side-bar>

    <v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      fixed
    >
      <v-toolbar-title>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <router-link :to="'/'">
          <span class=" white--text">Project Bluefire</span>
        </router-link>

      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- search bar -->
      <v-text-field
        disabled
        flat
        solo-inverted
        prepend-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn icon disabled>
        <v-icon>apps</v-icon>
      </v-btn>

      <v-btn icon disabled>
        <v-icon>notifications</v-icon>
      </v-btn>

    </v-toolbar>

    <!-- MAIN CONTENT -->
    <v-content>
      <router-view/>
    </v-content>

    <!-- Bootom: located in common/ -->
    <Bottom></Bottom>
  </v-app>
</template>

<script>
import Bottom from './common/Bottom'
import SideBar from './common/SideBar'

export default {
  name: 'App',
  components: {SideBar, Bottom},
  props: {
    source: String
  },
  data () {
    return {
      drawer: false,
      dialog: false
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style>
#inspire {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  a {
    text-decoration: none

  }
</style>
