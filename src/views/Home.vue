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
      <v-col cols="4" v-for="item in items" :key="item.icon"  class="text-center">
        <v-card flat color="transparent" class="pa-2" :to="item.href">
          <v-icon size="8vw" :color="item.color" >{{ item.icon}}</v-icon>
          <v-card-text class="title font-weight-bold">{{ item.title }}</v-card-text>
          <v-card-text class=" pt-0">{{ item.desc }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
  export default {
    name: 'home',
    data: () => ({
      title: 'Home Page',
      missionStatement: 'An attempt to improve everything; beginning with weather.',
      items: [
        {icon: 'fa-cloud-download-alt', title: 'SWF', href: 'swf', color: 'blue darken-2', desc: 'Simple Weather Forecast (SWF). A simple daily forecast.'},
        {icon: 'fa-tools', title: 'Projects', href: 'projects', color: 'orange darken-2', desc: 'Small group of side projects including, peltiers, DHT Sensors, and ESP8266 modules.'},
        {icon: 'fa-comment-dots', title: 'Blog', href: 'blog', color: 'green darken-2', desc: 'Capturing the new build, day-by-day. Also some ideas and current events.'}
      ]
    })
  }
</script>

<style scoped>
</style>
