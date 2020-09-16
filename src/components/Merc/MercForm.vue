<template>
  <v-sheet>
    <h4 class="my-2"> Add an Appointment </h4>

    <v-alert v-show="!isUserAuthenticated" color="info" class="ma-0 pa-2">
      <v-icon size="20" class="pa-1 ma-1"> fa-info </v-icon>
      <span>Login to add an appointment.</span>
    </v-alert>

    <v-form ref="form" v-model="isValid" class="mt-5">

      <!-- username -->
      <v-sheet class="col col-10 pa-0 mx-1">
        <v-text-field outlined dense readonly
          v-model="authenticatedUser"
          placeholder=" "
          label="Requester"
          :disabled="!isUserAuthenticated"
        />
      </v-sheet>

      <!-- form data -->
      <v-sheet v-for="(i, k) in formSchema" class="col col-10 pa-0 mx-1" :key="k">
        <v-text-field outlined dense
          v-model="formData[k]"
          placeholder=" "
          :label="i.label"
          :readonly="i.readonly"
          :disabled="!isUserAuthenticated"
        />
      </v-sheet>

      <v-sheet class="col col-10 pa-0 mx-1">
        <vuetify-google-autocomplete dense outlined
           id="appointmentLocation"
           ref="appointmentLocation"
           placeholder=" "
           label="Appointment Location"
           v-on:placechanged="getAddressData"
           :disabled="!isUserAuthenticated"
        >
        </vuetify-google-autocomplete>
      </v-sheet>

      <v-sheet class="row pa-0 ma-0">

        <!-- Date Picker -->
        <v-col cols="5">
          <v-menu
            offset-y
            v-model="requestDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                readonly outlined dense
                v-model="requestDate"
                label="Requested Date"
                v-bind="attrs"
                v-on="on"
                :disabled="!isUserAuthenticated"
                class="ml-1"
              />
            </template>

            <v-date-picker
              no-title scrollable
              v-model="requestDate"
              @input="requestDateMenu = false"
            />
          </v-menu>
        </v-col>

        <v-col cols="5">
          <!-- Time Picker -->
          <v-menu
            ref="timeMenu"
            v-model="requestTimeMenu"
            :close-on-content-click="false"
            :return-value.sync="requestTime"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                readonly outlined dense
                v-model="requestTime"
                label="Requested Time"
                placeholder=" "
                v-bind="attrs"
                v-on="on"
                :disabled="!isUserAuthenticated"
                class=""
              />
            </template>

            <v-time-picker
              no-title scrollable
              v-if="requestTimeMenu"
              v-model="requestTime"
              @click:minute="$refs.timeMenu.save(requestTime)"
              :allowed-minutes="allowedMinuteStep"
            >
            </v-time-picker>
          </v-menu>

        </v-col>


      </v-sheet>


      <v-btn :disabled="!isValid || !isUserAuthenticated" @click="submitPOI()">
        Submit
      </v-btn>

    </v-form>

  </v-sheet>
</template>

<script>
export default {
  name: "MercForm",
  props: {},
  data () {
    return {
      isValid: true,
      requestDateMenu: false,
      requestDate: this.dayjs().format('YYYY-MM-DD'),
      requestTimeMenu: false,
      requestTime: null,
      allowedMinuteStep: m => m % 15 === 0,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      formData: {},
      formSchema: {
        client_name: {
          label: 'Client Name',
          type: 'text'
        },
        client_email: {
          label: 'Client Email',
          type: 'text',
        }
      }
    }
  },
  created () {},
  destroyed () {},
  mounted () {  },
  computed: {
    authenticatedUser() {
      return this.$store.state.authenticatedUser.name
    },
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    }
  },
  watch: {},
  methods: {
    getAddressData (addressData, placeResultData, id) {
      this.appointmentLocation = addressData;
      console.log('this address', this.appointmentLocation)
    },
    submitPOI() {
      this.reset()
    },
    reset() {
      this.$refs.form.reset()
    },
  }
}
</script>

<style scoped>
</style>
