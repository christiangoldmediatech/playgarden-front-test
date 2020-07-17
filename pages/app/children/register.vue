<template>
  <v-row class="flex-column-reverse flex-md-row" justify="center" no-gutters>
    <v-col class="px-12" cols="12" lg="7" md="8" xl="5">
      <register-form :loading="loading" @click:submit="onSubmit" />
    </v-col>

    <v-col class="px-12" cols="12" lg="3" md="4" xl="2">
      <p>
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

import RegisterForm from '@/components/forms/children/RegisterForm'

export default {
  name: 'Register',

  components: {
    RegisterForm
  },

  data: () => ({
    loading: false
  }),

  computed: {
    inSignUpProcess () {
      const { query } = this.$route

      return query.process === 'signup' && query.step === '2'
    }
  },

  methods: {
    ...mapActions('children', { storeChildren: 'store' }),

    async onSubmit (children) {
      this.loading = true

      try {
        await Promise.all(children.map(child => this.storeChildren(child)))

        this.$snotify.success('Children have been stored successfully!')

        if (this.inSignUpProcess) {
          await this.$router.push({
            name: 'app-payment-register',
            query: { process: 'signup', step: '3' }
          })
        } else {
          await this.$router.push({ name: 'app-children' })
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>