<template>
  <v-app id="inspire">
    <SideBar :drawer="drawer"></SideBar>

    <v-app-bar color="blue darken-3"
     app dark fixed
     :clipped-left="$vuetify.breakpoint.lgAndUp"
     src="@/assets/images/bluefire-header-img.jpg"
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(30,144,255,.3), rgba(48,48,48,1)"
          ></v-img>
        </template>

        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>Project Bluefire</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon disabled>
          <v-icon>fa-cubes</v-icon>
        </v-btn>

        <v-btn icon disabled>
          <v-icon>fa-bell</v-icon>
        </v-btn>

        <v-btn icon disabled>
          <v-icon>fa-user</v-icon>
        </v-btn>

      </v-app-bar>

      <!-- MAIN CONTENT -->
      <v-content>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-content>

      <!-- Bootom: located in common/ -->
      <Bottom></Bottom>

  </v-app>
</template>
<script>
  import Bottom from '@/common/Bottom'
  import SideBar from '@/common/SideBar'
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
.custom-no-radius {
  border-radius: 0px !important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
