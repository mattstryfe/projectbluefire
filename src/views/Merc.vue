<template>
  <v-container fluid>
    <v-sheet>
      <span>userID: {{ this.user_id }}</span>
      <br />
      <span>connected: {{ this.isSocketConnected}} </span>
      <br/>
      <span>message: {{ this.socketMessage.msg }} </span>
      <br />
      <v-btn @click="sendUserId()">
        userID
      </v-btn>

      <br />
      <span> signedin? {{ isSignedIn }}</span> : {{ googleID }}
    </v-sheet>

    <SWFMap
      :isSocketConnected="isSocketConnected"
      :socketMessage="socketMessage.msg">

    </SWFMap >
  </v-container>
</template>

<script>
import { uuid } from 'vue-uuid'
import SWFMap from '@/components/SWFMap/SWFMap'

export default {
  name: 'Merc',
  props: {},
  components: {SWFMap},
  data() {
    return {
      userLoc: null,
      isSocketConnected: false,
      socketMessage: '',
      user_id: null,
      isSignedIn: false,
      googleID: null
    }
  },
  created() {
    this.launchAuthentication()
  },
  destroyed() {},
  mounted() {
    // get user id
    this.user_id = uuid.v4();
    this.initiateUserConnection()
  },
  computed: {},
  watch: {},
  sockets: {
    userConnected(data){
      console.log('user has connected!', data)
      this.socketMessage = data
      this.isSocketConnected = true
    },

    // pingReply(data) {
    //   console.log('pingReply!', data)
    // },
    // ping(data) {
    //   console.log('pinging!')
    //   this.$socket.emit('ping', data)
    //
    // }
    // newLocation(position) {
    //   console.log('newLoc running!')
    //   this.center = {
    //     ...position
    //   };
    //   const latLng = new this.google.maps.LatLng(position);
    //   this.showLocationUpdate = true;
    //   this.message = "The user's location has changed";
    //   if (
    //     !this.google.maps.geometry.poly.containsLocation(
    //       latLng,
    //       this.theRanchPolygon
    //     )
    //   ) {
    //     this.showAlert = true;
    //   } else {
    //     this.message = "The user is currently in the ranch";
    //   }
    // }
  },
  methods: {
    async launchAuthentication() {
      const googleUser = await this.$gAuth.signIn()
      this.isSignedIn = this.$gAuth.isAuthorized
      console.log('user is signed in', this.isSignedIn)
      this.googleID = googleUser.getId()
      this.googleProfile = googleUser.getBasicProfile()
      console.log('google profile', this.googleProfile)

      // const authCode = await this.$gAuth.getAuthCode()
      // console.log('authCode', authCode)
      // const authCode = await this.$gAuth.getAuthCode()
      // console.log('authCode,', authCode)
      // const response = await this.$http.post('http://your-backend-server-api-to-use-authcode', { code: authCode, redirect_uri: 'postmessage' })
    },
    initiateUserConnection() {
      this.$socket.client.emit('userConnection', this.user_id)
    },
    sendUserId() {
      this.$socket.client.emit('customPing', this.user_id)
    },
    async getUserLocation() {
      this.$socket.emit('ping', location);

      // const { lat, lng } = await this.$getLocation()
      // this.userLoc = {lat, lng}
      // console.log('this.userLoc', this.userLoc)
      // this.$socket.emit("ping", this.userLoc);
      //
      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(position => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('emitting!', this.$socket)
          this.$socket.emit("ping", location);
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
