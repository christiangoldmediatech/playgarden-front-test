<template>
  <section>
    <v-row no-gutters>
      <p v-show="errorMessage" class="error-message">
        <v-icon color="error">
          mdi-close-circle
        </v-icon>
        {{ errorMessage }}
      </p>

      <v-col class="px-12" cols="12" md="8">
        <signup-form :loading="isLoadingForm" @click:submit="handleSignup" />
      </v-col>

      <v-col class="px-12" cols="12" md="4">
        <p>
          <span class="font-weight-bold text-h5">
            MEMBERSHIP
          </span>

          <br>

          <small>Complete your registration and membership subscription to start enjoying our learning experience!</small>
        </p>

        <p>
          Pricing:

          <br>

          <span class="font-weight-bold">Pay $0.99 USD a day for first child and $0.20 USD a day per additional*</span>
        </p>

        <p>*Get a FREE trial for the first week!</p>

        <p>
          <small>You can cancel at any time from your account settings</small>
        </p>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import SignupForm from '@/components/forms/auth/SignupForm'

export default {
  name: 'Signup',

  middleware: ['redirectToAuthPage'],

  components: {
    SignupForm
  },

  data () {
    return {
      isLoadingForm: false,
      errorMessage: ''
    }
  },

  methods: {
    async handleSignup (user) {
      try {
        this.isLoadingForm = true
        // TODO: move to store and use mapActions
        const { data } = await this.$axios.post(`${process.env.apiBaseUrl}/auth/signup`, user)
        // set auth token
        this.$store.dispatch('auth/setToken', data.accessToken)
        this.errorMessage = ''
        this.$router.push({ name: 'app-children' })
      } catch (error) {
        this.handleSignupError(error)
      } finally {
        this.isLoadingForm = false
      }
    },
    handleSignupError (error) {
      // TODO: Remove this alert to a global component
      this.errorMessage = 'Sorry! There was an error while signing you up.'
      // eslint-disable-next-line
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.error-message {
  color: $pg-error;
}
</style>
