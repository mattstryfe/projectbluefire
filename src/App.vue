<template>
  <v-app id="inspire">
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
              <img src="./assets/matt2.png" >
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
              @click=""
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

    <v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      fixed
    >
      <v-btn icon large>
        <img src="./assets/bluefire-logo-final.png"
             height="100%"
             width="100%"
             alt="logo"/>
      </v-btn>

      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer">

        </v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Project Bluefire</span>
      </v-toolbar-title>
      <v-text-field
        disabled
        flat
        solo-inverted
        prepend-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn icon disabled>
        <v-icon>apps</v-icon>
      </v-btn>

      <v-btn icon disabled>
        <v-icon>notifications</v-icon>
      </v-btn>

    </v-toolbar>

    <!-- MAIN CONTENT -->
    <v-content>

      <router-view/>

    </v-content>

    <!-- floating button on right side -->
    <v-btn
      disabled
      fab
      bottom
      right
      color="pink"
      dark
      fixed
      @click.stop="dialog = !dialog"
    >
      <v-icon>add</v-icon>
    </v-btn>

    <!-- dialog box controlled by floating button -->
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          Create contact
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="40px" class="mr-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  placeholder="Name"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="business"
                placeholder="Company"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                placeholder="Job title"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
                mask="phone"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                placeholder="Notes"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Footer: located in common/ -->
    <Bottom>
    </Bottom>
  </v-app>
</template>

<script>
  import Bottom from "./common/bottom";
	export default {
    name: 'App',
		components: {Bottom},
		data() {
      return {
        testProp: 'this is a test property from the main APP',
        dialog: false,
        drawer: false,
        mini: true,
        items: [
          {icon:'home', text:'Home', href:'/'},
          {icon:'cloud_done', text:'SWF', href:'/SWF'},
          {icon:'build', text: 'Projects', href: '/Projects'},
          {icon:'chat', text: 'Blog', href: '/Blog'}
        ]
      }

    },
    props: {
    	source: String,
    },
    created() {

		},
    methods: {

    }
  }
</script>

<style>
#inspire {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  a {
    text-decoration: none

  }
</style>
