<template>
  <v-navigation-drawer
    app
    fixed
    width="200"
    :clipped="$vuetify.breakpoint.lgAndUp"
    v-model="drawer"
    :mini-variant.sync="mini"
    mini-variant-width="80"
  >
    <!-- custom user drawer toolbar -->
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-item avatar @click.native.stop="mini = !mini">
          <v-list-item-avatar >
            <img src="@/assets/matt2.png" >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Matt</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click.native.stop="mini = !mini">
              <v-icon>fa-chevron_left</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-toolbar>
    <!-- end of toolbar add -->

    <v-divider></v-divider>

    <v-list
      nav
      dense
      v-for="item in items"
      :key="item.text"
    >
      <v-list-item link :to="item.href" >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
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
          {icon: 'fa-home', text: 'Home', href: '/'},
          {icon: 'fa-cloud-download-alt', text: 'SWF', href: '/SWF'},
          {icon: 'fa-tools', text: 'Projects', href: '/Projects'},
          {icon: 'fa-comment-dots', text: 'Blog', href: '/Blog'}
        ]
      }
    },
    created () {
    }
  }
</script>

<style scoped>
</style>
