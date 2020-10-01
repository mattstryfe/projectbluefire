<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x offset-y
    class="cust-z"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        class="mr-2 align-self-center justify-center"
        v-bind="attrs"
        v-on="on"
      >
        <span v-if="!isUserAuthenticated" @click="launchAuthentication()">Log In</span>
        <v-avatar v-else>
          <v-img
            :src="authenticatedUser.avatar"
            max-width="40"
            max-height="40"
          />
        </v-avatar>
      </v-btn>

    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar >
            <v-img
              v-if="isUserAuthenticated"
              :src="authenticatedUser.avatar"
              :alt="authenticatedUser.name"
            />
            <v-progress-circular
              v-else
              :width="3"
              color="blue lighten-2"
              indeterminate
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ authenticatedUser.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ authenticatedUser.email }}</v-list-item-subtitle>
          </v-list-item-content>

        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer/>

        <v-btn text @click="menu = false">Close</v-btn>
        <v-btn text @click="logout()" :disabled="!isUserAuthenticated">Logout</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {},
  components: {},
  data() {
    return {
      menu: false
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    authenticatedUser: {
      get() {
        return this.$store.state.authenticatedUser
      },
      set(value) {
        this.$store.commit('updateAuthenticatedUser', value)
      }
    },
    isUserAuthenticated: {
      get() {
        return this.$store.state.isUserAuthenticated
      },
      set(value) {
        this.$store.commit('isUserAuthenticated', value)
      }
    }
  },
  watch: {},
  methods: {
    async logout() {
      // close menu
      this.menu = false

      // log user out
      await this.$gAuth.signOut()

      // flip sign in toggle
      this.isUserAuthenticated = this.$gAuth.isAuthorized

      // clear all user data once signed out
      this.authenticatedUser = {
        avatar: null,
        name: null,
        email: null,
        id: null
      }
    },
    async launchAuthentication() {
      let googleUser
      try {
        googleUser = await this.$gAuth.signIn()

        this.isUserAuthenticated = this.$gAuth.isAuthorized
        // pull out user info
        const { TJ, Ad, $t, NT } = googleUser.rt
        // save to state via set()
        this.authenticatedUser = {
          avatar: TJ,
          name: Ad,
          email: $t,
          id: NT
        }
      }
      catch (e) {
        if (e.error === 'popup_closed_by_user') {
          this.menu = false
        }
      }
    },
  }
}
</script>

<style scoped>
.cust-z {
  z-index: 900;
}
</style>
