<template>
  <v-sheet>
    <v-alert v-show="!isUserAuthenticated" color="info" class="ma-0 pa-2">
      <v-icon size="20" class="pa-1 ma-1"> fa-info </v-icon>
      <span>Login to add an appointment.</span>
    </v-alert>

    <v-form ref="form" v-model="isValid" class="mt-5">

      <!-- username -->
      <v-sheet class="col col-10 pa-0 mx-1">
        <v-text-field outlined dense readonly
          v-model="authenticatedUser.name"
          placeholder=" "
          label="Requester"
          :disabled="!isUserAuthenticated"
        />
      </v-sheet>

      <!-- form data -->
      <v-sheet v-for="(i, k) in formSchema" class="col col-10 pa-0 mx-1" :key="k">
        <v-text-field outlined dense
          v-model="formData[k]"
          :placeholder="formSchema[k].placeholder || ' '"
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

        <!-- Time Picker -->
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
import { writeAppointmentToDb, getAppointmentFromDb } from '@/services/MercServices'

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
      formData: { },
      formSchema: {
        client_name: {
          label: 'Client Name',
          type: 'text',
          placeholder: 'basic person'
        },
        client_email: {
          label: 'Client Email',
          type: 'text',
          placeholder: 'my@email.com'
        }
      }
    }
  },
  created () {},
  destroyed () {},
  mounted () {  },
  computed: {
    authenticatedUser() {
      return this.$store.state.authenticatedUser
    },
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    }
  },
  watch: { },
  methods: {
    getAddressData (addressData, placeResultData, id) {
      this.appointmentLocation = addressData;
    },
    submitPOI() {
      console.log('user', this.authenticatedUser)
      this.formData = {
        appointment_location: this.appointmentLocation,
        authenticated_user: this.authenticatedUser.name,
        user_id: this.authenticatedUser.id,
        date_time: this.dayjs(`${this.requestDate}T${this.requestTime}`).format(),
        timestamp: this.dayjs().format(),
        status: 'new',
        priority: 'low',
        agent_info: { }
      }
      writeAppointmentToDb(this.formData)
      // this.reset()
    },
    reset() {
      this.$refs.form.reset()
    },
  }
}
</script>

<style scoped>
</style>
