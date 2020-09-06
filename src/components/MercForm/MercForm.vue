<template>
  <v-sheet>
    <h4 class="my-2"> Add an Appointment </h4>

    <v-alert v-show="!isUserAuthenticated" color="info" class="ma-0 pa-2">
      <v-icon size="20" class="pa-1 ma-1"> fa-info </v-icon>
      <span>Login to add an appointment.</span>
    </v-alert>

    <v-form ref="form" v-model="isValid" class="mt-5">
      <v-sheet v-for="(i, k) in formSchema" class="col col-10 pa-0 ma-0" :key="k">
        <v-text-field outlined dense
          v-model="formData[k]"
          placeholder=" "
          :label="i.label"
          :readonly="i.readonly"
          :disabled="!isUserAuthenticated"
        />
      </v-sheet>

      <!-- Date Picker -->
      <v-sheet class="col col-10 pa-0 ma-0">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="request_date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field readonly outlined dense
              v-model="request_date"
              label="Requested Date"
              prepend-icon="fa-calendar"
              v-bind="attrs"
              v-on="on"
              :disabled="!isUserAuthenticated"
            />
          </template>

          <v-date-picker v-model="request_date" no-title scrollable @input="menu = false">
            <v-spacer/>
            <v-btn text color="" @click="menu = false">Cancel</v-btn>
            <v-btn text color="success" @click="$refs.menu.save(request_date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
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
  components: {},
  data () {
    return {
      isValid: true,
      menu: false,
      request_date: this.dayjs().format('YYYY-MM-DD'),
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      formData: {},
      formSchema: {
        submitter_name: {
          label: 'Submitter',
          type: 'text',
          placeholder: '',
          readonly: true
        },
        client_name: {
          label: 'Client Name',
          type: 'text'
        },
        client_email: {
          label: 'Client Email',
          type: 'text',
        },
        requested_destination: {
          label: 'Destination',
          type: 'text'
        },
        requested_time: {
          label: 'Time Requested',
          type: 'text'
        }
      }
    }
  },
  created () {},
  destroyed () {},
  mounted () {},
  computed: {
    authenticated_user() {
      return this.$store.state.authenticated_user
    },
    isUserAuthenticated() {
      return this.$store.state.isUserAuthenticated
    }
  },
  watch: {
    isUserAuthenticated(newVal, oldVal) {
      console.log('isUserAuthenticated changed', this.authenticated_user)
      if (newVal) {
        this.formSchema.submitter_name.placeholder = this.authenticated_user.name
        // this.formSchema.submitter_email.placeholder = this.authenticated_user.email
      }

      if (!newVal) {
        this.formSchema.submitter_name.placeholder = 'fake name'

      }
    }
  },
  methods: {
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
