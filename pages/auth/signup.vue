<template>
  <v-row class="flex-column-reverse flex-md-row" justify="center" no-gutters>
    <v-col class="px-12" cols="12" lg="7" md="8" xl="5">
      <p class="text-center text-md-left">
        <span class="font-weight-bold text-h5">
          PARENT'S INFORMATION
        </span>
      </p>
      <signup-form :loading="loading" @click:submit="onSubmit" />
    </v-col>

    <v-col class="px-12" cols="12" lg="3" md="4" xl="2">
      <p class="text-center text-md-left">
        <span class="font-weight-bold text-h5">
          MEMBERSHIP
        </span>

        <br>

        <small>
          Complete your registration and membership subscription to start
          enjoying our learning experience!
        </small>
      </p>

      <p>
        Pricing:

        <br>

        <span class="font-weight-bold">
          Pay $0.99 USD a day for first child and $0.20 USD a day per
          additional*
        </span>
      </p>

      <p>*Get a FREE trial for the first week!</p>

      <p>
        <small>You can cancel at any time from your account settings</small>
      </p>
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

  data: () => ({
    loading: false
  }),

  methods: {
    ...mapActions('auth/signup', ['signup']),

    async onSubmit (data) {
      this.loading = true

      try {
        await this.signup(data)

        this.$snotify.success('Welcome to Playgarden Prep!')

        await this.$router.push({
          name: 'app-children-register',
          query: { process: 'signup', step: '2' }
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.error-message {
  color: $pg-error;
}
</style>
