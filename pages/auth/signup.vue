<template>
  <v-row class="flex-column-reverse flex-md-row" justify="center" no-gutters>
    <v-col class="px-12" cols="12" md="8">
      <p class="text-center text-md-left">
        <span class="font-weight-bold text-h5">
          PARENT'S INFORMATION
        </span>
      </p>

      <signup-form
        :in-invitation-process="inInvitationProcess"
        :loading="loading"
        @click:submit="onSubmit"
      />
    </v-col>

    <v-col class="px-12" cols="12" md="4">
      <span class="font-weight-bold text-h5">
        MEMBERSHIP
      </span>
      <v-container row class="lighten-5">
        <v-row
          no-gutters
          class="info-signIn"
        >
          <small>
            Complete your registration and membership subscription to start
            enjoying our learning experience!
          </small>
        </v-row>
      </v-container>
      <p class="text-center text-md-left">
        <br>
      </p>

      <template v-if="!inInvitationProcess">
        <p>
          Pricing:

          <br>

          <span class="font-weight-bold">
            Pay $0.99 USD a day for first child and $0.20 USD a day per
            additional*
          </span>
        </p>

        <p class="subtitle-signIn">
          Get one week FREE trial
        </p>

        <p>
          <small>You can cancel at any time from your account settings</small>
        </p>
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import SignupForm from '@/components/forms/auth/SignupForm'

export default {
  name: 'Signup',

  components: {
    SignupForm
  },

  data: vm => ({
    loading: false,
    inInvitationProcess: (() => {
      const { query } = vm.$route

      return Boolean(
        query.process === 'invitation' &&
          (query.email || query.phone) &&
          query.token
      )
    })(),
    token: vm.$route.query.token
  }),

  methods: {
    ...mapActions('auth/signup', { newParent: 'signup' }),

    ...mapActions('caregiver', { newCaregiver: 'signup' }),

    async onSubmit (data) {
      this.loading = true

      await this.registerProcess(
        this.inInvitationProcess ? { data, token: this.token } : data
      )

      this.$snotify.success('Welcome to Playgarden Prep!')

      if (this.inInvitationProcess) {
        await this.$router.push({ name: 'app-dashboard' })
      } else {
        await this.$router.push({
          name: 'app-children-register',
          query: { process: 'signup', step: '2' }
        })
      }

      this.loading = false
    },

    async registerProcess (data) {
      return this.inInvitationProcess
        ? await this.newCaregiver(data)
        : await this.newParent(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-h5 {
  color: $pg-black !important;
}

.subtitle-signIn {
  color: $pg-black !important;
  font-weight: 600 !important;
}
.info-signIn {
  margin-top: 10px !important;
}
</style>
