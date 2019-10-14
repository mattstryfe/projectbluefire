<template>
  <v-app id="inspire">

    <v-app-bar color="blue darken-3"
      dark app fixed shrink-on-scroll
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      src="@/assets/images/bluefire-header-img.jpg"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(30,144,255,.3), rgba(48,48,48,1)"
        ></v-img>
      </template>

      <template v-slot:extension>
        <!-- search bar -->
        <v-row>
          <v-col cols="4">
            <v-text-field
              align-with-title
              disabled
              flat
              solo-inverted
              prepend-icon="fa-search"
              label="Search"
              class="hidden-sm-and-down"
            ></v-text-field>
          </v-col>
        </v-row>

      </template>

      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>Project Bluefire</v-toolbar-title>

      <v-spacer></v-spacer>



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

  </v-app>

</template>

<style>
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
