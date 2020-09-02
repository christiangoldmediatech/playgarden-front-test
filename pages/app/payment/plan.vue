<template>
  <subscription-plan-selection @click:submit="onSubmit" />
</template>

<script>
import { mapActions } from 'vuex'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'

export default {
  name: 'Plan',

  components: {
    SubscriptionPlanSelection
  },

  computed: {
    inSignUpProcess () {
      const { query } = this.$route

      return query.process === 'signup' && query.step === '3'
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    async onSubmit () {
      try {
        if (this.inSignUpProcess) {
          await this.fetchUserInfo()

          await this.$router.push({
            name: 'app-payment-register',
            query: { process: 'signup', step: '4' }
          })
        }
      } catch (e) {
      } finally {
      }
    }
  }
}
</script>
