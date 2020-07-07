<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" md="8" class="px-12">
        <signup-form :loading="isLoadingForm" @click:submit="handleSignup" />
      </v-col>

      <v-col cols="12" md="4" class="px-12">
        <p>
          <span class="text-h5 font-weight-bold">
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
  </v-container>
</template>

<script>
import SignupForm from '@/components/forms/auth/SignupForm'

export default {
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
        const { data } = await this.$axios.post(`${process.env.apiBaseUrl}/auth/signup`, user)
        // set auth token
        this.$store.dispatch('auth/setToken', data.accessToken)
        this.errorMessage = ''
        this.$router.push({ name: 'children' })
      } catch (error) {
        this.handleSignupError(error)
      } finally {
        this.isLoadingForm = false
      }
    },
    handleSignupError (error) {
      this.errorMessage = 'Oops! Error'
      // eslint-disable-next-line
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  height: 100%;
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    height: 100%;
  }
}
.error-message {
  color: $pg-error;
}
</style>
