<template>
  <v-sheet>
    <!-- login warning -->
    <v-alert
      outlined
      text
      v-show="!isUserAuthenticated"
      color="info"
      class="ma-0 mt-2 pa-2"
      type="info"
    >
      <span>Login to add an appointment.</span>
    </v-alert>

    <v-form ref="form" v-model="isValid" class="mt-5">
      <!-- username -->
      <v-sheet class="col col-10 pa-0 mx-1">
        <v-text-field
          outlined
          dense
          readonly
          v-model="authenticatedUser.name"
          placeholder=" "
          label="Requester"
          :disabled="!isUserAuthenticated"
        />
      </v-sheet>

      <!-- form data -->
      <!-- Client Name -->
      <v-sheet class="col col-10 pa-0 mx-1">
        <v-text-field
          outlined
          dense
          v-model="client_name.value"
          :placeholder="client_name.placeholder"
          :label="client_name.label"
          :disabled="!isUserAuthenticated"
        />
      </v-sheet>

      <!-- Client Email -->
      <v-sheet class="col col-10 pa-0 mx-1">
        <v-text-field
          outlined
          dense
          v-model="client_email.value"
          :placeholder="client_email.placeholder"
          :label="client_email.label"
          :disabled="!isUserAuthenticated"
        />
      </v-sheet>

      <!-- Appointment Address -->
      <v-sheet class="col col-10 pa-0 mx-1">
        <vuetify-google-autocomplete
          dense
          outlined
          id="appointmentLocation"
          ref="appointmentLocation"
          placeholder=" "
          label="Appointment Location"
          v-on:placechanged="getAddressData"
          :disabled="!isUserAuthenticated"
        ></vuetify-google-autocomplete>
      </v-sheet>

      <!-- Appointment Date & Time -->
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
                readonly
                outlined
                dense
                v-model="requestDate"
                label="Requested Date"
                v-bind="attrs"
                v-on="on"
                :disabled="!isUserAuthenticated"
                class="ml-1"
              />
            </template>

            <v-date-picker
              no-title
              scrollable
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
                readonly
                outlined
                dense
                v-model="requestTime"
                label="Requested Time"
                placeholder=" "
                v-bind="attrs"
                v-on="on"
                :disabled="!isUserAuthenticated"
              />
            </template>

            <v-time-picker
              no-title
              scrollable
              v-if="requestTimeMenu"
              v-model="requestTime"
              @click:minute="$refs.timeMenu.save(requestTime)"
              :allowed-minutes="allowedMinuteStep"
            ></v-time-picker>
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
import { writeAppointmentToDb } from '@/services/MercServices'

export default {
  name: 'MercForm',
  props: {},
  data() {
    return {
      isValid: true,
      requestDateMenu: false,
      requestDate: this.dayjs().format('YYYY-MM-DD'),
      requestTimeMenu: false,
      requestTime: null,
      allowedMinuteStep: (m) => m % 15 === 0,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      formData: {},
      client_name: {
        value: ' ',
        label: 'Client Name',
        type: 'text',
        placeholder: 'basic person'
      },
      client_email: {
        value: ' ',
        label: 'Client Email',
        type: 'text',
        placeholder: 'my@email.com'
      }
    }
  },
  created() {},
  destroyed() {},
  mounted() {},
  computed: {
    authenticatedUser() {
      return this.$store.state.authenticatedUser
    },
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    }
  },
  watch: {},
  methods: {
    getAddressData(addressData) {
      this.appointmentLocation = addressData
    },
    async submitPOI() {
      this.formData = {
        type: 'Feature',
        properties: {
          appointment_location: this.appointmentLocation,
          requester: this.authenticatedUser.name,
          requester_id: this.authenticatedUser.id,
          date_time: this.dayjs(
            `${this.requestDate}T${this.requestTime}`
          ).format(),
          timestamp: this.dayjs().format(),
          status: 'new',
          priority: 'low',
          agent_info: {},
          client_info: {
            name: this.client_name.value,
            email: this.client_email.value
          }
        },
        geometry: {
          type: 'Point',
          coordinates: [
            this.appointmentLocation.longitude,
            this.appointmentLocation.latitude
          ]
        }
      }
      await writeAppointmentToDb(this.formData)
      this.$store.dispatch('refreshAppointments')
    },
    reset() {
      this.$refs.form.reset()
    }
  }
}
</script>

<style scoped></style>
