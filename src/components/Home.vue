<template>
  <div class="hello">
    <v-jumbotron color="transparent" height="125px" class="mb-2">
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">Project Bluefire</h3>
            <span class="subheading">{{ missionStatement }}</span>
            <v-divider class="my-3"></v-divider>



            <!--<div class="title mb-3">Check out our newest features!</div>-->
            <!--<v-btn large color="primary" class="mx-0">See more</v-btn>-->
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>

    <!-- Main page large buttons! -->
    <v-layout row justify-space-around>
      <v-flex xs3 v-for="item in items" :key="item.icon">
        <v-card class="flat transparent pa-2"
                :to="item.href"
        >
          <v-icon size="8vw" :color="item.color" >{{ item.icon}}</v-icon>
          <v-card-text class="title">{{ item.title }}</v-card-text>
          <v-card-text class="px-0 cut-text test">{{ item.desc }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </div>

</template>

<script>
  export default {
    name: 'home',
    data: () => ({
      title: 'Home Page',
      missionStatement: 'An attempt to improve everything; beginning with weather.',
      items: [
        {icon:'cloud_done', title: 'SWF', href:'SWF',       color: 'blue darken-2',    desc: 'Simple Weather Forecast (SWF). A simple daily forecast.'},
        {icon:'build', title: 'Projects',  href:'Projects', color: 'orange darken-2',  desc: 'Small group of side projects including, peltiers, DHT Sensors, and ESP8266 modules.'},
        {icon:'chat', title: 'Blog', href:'Blog',           color: 'green darken-2',   desc: 'Capturing the new build, day-by-day. Also some ideas and current events.'}
      ]
    })
  }
</script>

<style scoped>
  cut-text {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  test {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
</style>
