<template>
  <v-card class="overflow-hidden">
    <v-app-bar app dark src="@/assets/images/bluefire-header-img.jpg">
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(30,144,255,.3), rgba(48,48,48,1)"
        />
      </template>

      <router-link to="/" class="no-underline white--text">
        <v-toolbar-title>Project Bluefire</v-toolbar-title>
      </router-link>

      <v-spacer />

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

    <v-sheet
      id="scrolling-techniques-5"
      class="overflow-y-auto"
      max-height="600"
    >
      <v-container style="height: 1500px"></v-container>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  name: 'AppBar',
  data() {
    return {
      drawer: true
    }
  },
  computed: {
    drawerToggle: {
      get() {
        return this.$store.state.drawerToggle
      },
      set(newValue) {
        this.$store.commit('changeDrawerToggle', newValue)
      }
    }
  }
}
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
/*.custom-no-radius {*/
/*  border-radius: 0px !important;*/
/*}*/
/*#app {*/
/*  font-family: "Candara", Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  }*/
</style>
