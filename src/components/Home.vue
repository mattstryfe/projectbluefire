<template>
  <div class="hello">
    <v-jumbotron color="grey lighten-2">
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">Project Bluefire</h3>
            <span class="subheading">{{ missionStatement }}</span>
            <v-divider class="my-3"></v-divider>

            <!-- Main page large buttons! -->
            <v-layout row wrap>
              <v-flex xs4 v-for="item in items" :key="item.icon">
                <!--<v-card dark color="transparent">-->
                  <v-icon size="8em" color="blue darken-2">{{ item.icon}}</v-icon>
                  <v-card-text class="px-3">{{ item.title }}</v-card-text>
                  <v-card-text class="px-0">{{ item.desc }}</v-card-text>
                <!--</v-card>-->
              </v-flex>
            </v-layout>

            <!--<div class="title mb-3">Check out our newest features!</div>-->
            <!--<v-btn large color="primary" class="mx-0">See more</v-btn>-->
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </div>

</template>

<script>
  export default {
    name: 'home',
    data: () => ({
      title: 'Home Page',
      missionStatement: 'An attempt to improve everything; beginning with weather.',
      items: [
        {icon:'cloud_done', title: 'SWF', href:'SWF',       color: 'blue',    desc: 'Simple Weather Forecast (SWF). A simple daily forecast. Data harvested from weather.gov\'s API.'},
        {icon:'build', title: 'Projects',  href:'Projects', color: 'orange',  desc: 'Small group of side projects including, peltiers, DHT Sensors, and ESP8266 modules.'},
        {icon:'chat', title: 'Blog', href:'Blog',           color: 'green',   desc: 'Capturing the new build, day-by-day. Also some ideas and current events.'}
      ]
    })
  }
</script>

<style scoped>

</style>
