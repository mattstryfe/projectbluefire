<template>
  <v-app id="">
    <SideBar :drawer="drawer"/>
    <AppBar />

<!--    <v-app-bar color="blue darken-3"-->
<!--     app dark fixed-->
<!--     :clipped-left="$vuetify.breakpoint.lgAndUp"-->
<!--     src="@/assets/images/bluefire-header-img.jpg"-->
<!--    >-->
<!--      <template v-slot:img="{ props }">-->
<!--        <v-img-->
<!--          v-bind="props"-->
<!--          gradient="to top right, rgba(30,144,255,.3), rgba(48,48,48,1)"-->
<!--        />-->
<!--      </template>-->

<!--      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>-->

<!--      <v-divider class="mx-7" inset vertical/>-->

<!--      <router-link to="/" class="no-underline white&#45;&#45;text">-->
<!--        <v-toolbar-title>Project Bluefire</v-toolbar-title>-->
<!--      </router-link>-->

<!--      <v-spacer/>-->

<!--      <v-btn icon disabled>-->
<!--        <v-icon>fa-cubes</v-icon>-->
<!--      </v-btn>-->

<!--      <v-btn icon disabled>-->
<!--        <v-icon>fa-bell</v-icon>-->
<!--      </v-btn>-->

<!--      <v-btn icon disabled>-->
<!--        <v-icon>fa-user</v-icon>-->
<!--      </v-btn>-->

<!--    </v-app-bar>-->

    <!-- MAIN CONTENT -->
    <v-content>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>

    <!-- Bootom: located in common/ -->
    <Bottom/>

  </v-app>
</template>
<script>
import Bottom from '@/common/Bottom'
import SideBar from '@/common/SideBar'
import AppBar from "@/common/AppBar";
export default {
  name: 'App',
  components: {AppBar, SideBar, Bottom },
  props: {
    source: String
  },
  data () {
    return {
      drawer: true,
      dialog: false
    }
  },
  created () {},
  methods: {}
}
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
.custom-no-radius {
  border-radius: 0px !important;
}
#app {
  font-family: 'Candara', Helvetica, Arial, sans-serif;
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
