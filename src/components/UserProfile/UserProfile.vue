<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x offset-y
    class="cust-z"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon class="mr-5 mt-5"
        v-bind="attrs"
        v-on="on"
      >
        <span v-if="!isSignedIn" @click="launchAuthentication()">Log In</span>
        <v-avatar v-else>
          <v-img :src="authenticated_user.avatar"></v-img>
        </v-avatar>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar >
            <v-img v-if="isSignedIn"
                 :src="authenticated_user.avatar"
                 :alt="authenticated_user.name"
            />

            <v-progress-circular
              v-else
              :width="3"
              color="blue lighten-2"
              indeterminate
            />

          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ authenticated_user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ authenticated_user.email }}</v-list-item-subtitle>
          </v-list-item-content>

        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="menu = false">Close</v-btn>
        <v-btn text @click="logout()" :disabled="!isSignedIn">Logout</v-btn>
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
      isSignedIn: false,
      menu: false,
      user_avatar: null,
      user_name: null,
      user_email: null,
      user_id: null
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    authenticated_user: {
      get() {
        return this.$store.state.authenticated_user
      },
      set(value) {
        this.$store.commit('updateAuthenticatedUser', value)
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
      this.isSignedIn = this.$gAuth.isAuthorized

      // clear all user data once signed out
      this.authenticated_user = {}

    },
    async launchAuthentication() {
      let googleUser
      try {
        googleUser = await this.$gAuth.signIn()
        this.isSignedIn = this.$gAuth.isAuthorized

        // Pull out user info
        this.user_id = googleUser.getId()

      }
      catch (e) {
        if (e.error === 'popup_closed_by_user') {
          this.menu = false
          return
        }
      }

      console.log('googleUser', googleUser)

      const { TJ, Ad, $t, NT } = googleUser.rt
      // this.user_avatar = PK
      // this.user_name = Cd
      // this.user_email = yu
      this.authenticated_user = {
        avatar: TJ,
        name: Ad,
        email: $t,
        id: NT
      }
      // console.log('googleID', this.user_id, ' is signed in? ', this.isSignedIn)
    },
  }
}
</script>

<style scoped>
.cust-z {
  z-index: 900;
}
</style>
