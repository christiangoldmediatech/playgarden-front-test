<template>
  <v-row no-gutters>
    <v-col>
      <v-row class="mb-6" no-gutters>
        <v-btn
          v-if="initialized && inSignUpProcess"
          color="accent"
          nuxt
          text
          :to="{
            name: 'app-children-register',
            query: { process: 'signup', step: '2' }
          }"
        >
          <v-icon left>
            mdi-less-than
          </v-icon>

          Back
        </v-btn>
      </v-row>

      <subscription-plan-selection
        class="mt-n6"
        @click:submit="onSubmit"
        @initialized="initialized = true"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'

export default {
  name: 'Plan',

  components: {
    SubscriptionPlanSelection
  },

  data: () => ({
    initialized: false
  }),

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
