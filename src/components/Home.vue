<template>
  <div class="hello">
    <v-jumbotron color="grey lighten-2">
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">Project Bluefire</h3>
            <span class="subheading">{{ missionStatement }}</span>
            <v-divider class="my-3"></v-divider>
            <div class="title mb-3">Check out our newest features!</div>
            <v-btn large color="primary" class="mx-0">See more</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
    <v-icon size="12em" color="blue darken-2">cloud_done</v-icon>
  </div>

</template>

<script>
  export default {
    name: 'home',
    data: () => ({
      title: 'Home Page',
      missionStatement: 'An attempt to improve everything; beginning with weather.',
    })
  }
</script>

<style scoped>

</style>
