<template>
<div>
  <v-navigation-drawer
    fixed
    width="200"
    :clipped="$vuetify.breakpoint.lgAndUp"
    app
    v-model="drawer"
    :mini-variant.sync="mini"
    mini-variant-width="80"
  >
    <!-- custom user drawer toolbar -->
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar @click.native.stop="mini = !mini">
          <v-list-tile-avatar >
            <img src="../assets/matt2.png" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Matt</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.native.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <!-- end of toolbar add -->

    <v-list dense>
      <template v-for="item in items">
        <v-layout
          row
          v-if="item.heading"
          align-center
          :key="item.heading"
        >
          <v-flex xs6>
            <v-subheader v-if="item.heading" >
              {{ item.heading }}
            </v-subheader>
          </v-flex>
          <v-flex xs6 class="text-xs-center">
            <a href="#!" class="body-2 black--text">EDIT</a>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.children"
          v-model="item.model"
          :key="item.text"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon=""
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="(child, i) in item.children"
            :key="i"
            :href="item.name"
          >
            <v-list-tile-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ child.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else :key="item.text" :to="item.href">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</div>

</template>

<script>
export default {
  name: 'SideBar',
  components: {},
  props: {
    drawer: Boolean
  },
  data () {
    return {
      mini: true,
      items: [
        {icon: 'home', text: 'Home', href: '/'},
        {icon: 'cloud_done', text: 'SWF', href: '/SWF'},
        {icon: 'build', text: 'Projects', href: '/Projects'},
        {icon: 'chat', text: 'Blog', href: '/Blog'}
      ]
    }
  },
  created () {
  }
}
</script>

<style scoped>

</style>
