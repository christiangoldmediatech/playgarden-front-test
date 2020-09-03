<template>
  <v-row class="flex-column-reverse flex-md-row" justify="center" no-gutters>
    <v-col class="px-12" cols="12" md="8">
      <register-form :loading="loading" @click:submit="onSubmit" />
    </v-col>

    <v-col class="px-12" cols="12" md="4">
      <p>
        <span class="font-weight-bold text-h5">
          MEMBERSHIP
        </span>

        <br>

        <small>
          Complete the registration and choose the plan that best suits you, to
          start your learning experience!
        </small>
      </p>

      <p>
        <span class="font-weight-bold">
          Get one week FREE trial
        </span>
      </p>

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
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('children', { storeChildren: 'store' }),

    async onSubmit (children) {
      this.loading = true

      try {
        await Promise.all(children.map(child => this.storeChildren(child)))

        await this.fetchUserInfo()

        this.$snotify.success('Children have been stored successfully!')

        if (this.inSignUpProcess) {
          await this.$router.push({
            name: 'app-payment-plan',
            query: { process: 'signup', step: '3' }
          })
        } else {
          await this.$router.push({ name: 'app-account' })
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
