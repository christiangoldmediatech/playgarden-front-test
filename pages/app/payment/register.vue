<template>
  <v-row class="flex-column-reverse flex-md-row" justify="center" no-gutters>
    <v-col class="px-12" cols="12" lg="7" md="8" xl="5">
      <stripe-form :loading="loading" @click:submit="onSubmit" />
    </v-col>

    <v-col class="px-12" cols="12" lg="3" md="4" xl="3">
      <p class="text-center text-md-left">
        <span class="font-weight-bold text-h5">
          MEMBERSHIP REVIEW
        </span>
      </p>

      <v-row
        v-for="(item, indexCI) in cost.items"
        :key="indexCI"
        class="px-12 py-2"
      >
        MEMBERSHIP {{ indexCI + 1 }}

        <v-spacer />

        <b>${{ item.price }}</b>
      </v-row>

      <v-divider />

      <v-row class="px-12">
        TOTAL

        <v-spacer />

        <b>${{ cost.total || 0 }}</b>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import StripeForm from '@/components/forms/payment/StripeForm'

export default {
  name: 'Register',

  components: {
    StripeForm
  },

  data: () => ({
    cost: {},
    loading: false
  }),

  computed: {
    inSignUpProcess () {
      const { query } = this.$route

      return query.process === 'signup' && query.step === '3'
    }
  },

  created () {
    this.fetchSubCosts()
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('payment', [
      'fetchSubscriptionCost',
      'paySubscription',
      'validateCard'
    ]),

    async fetchSubCosts () {
      try {
        this.cost = await this.fetchSubscriptionCost()
      } catch (e) {}
    },

    async onSubmit (cardData) {
      this.loading = true

      try {
        const token = await this.validateCard(cardData)

        await this.paySubscription(token)

        if (this.inSignUpProcess) {
          await this.fetchUserInfo()
          this.$snotify.success('Payment has been processed successfully!')
          await this.$router.push({ name: 'auth-verify-email' })
        } else {
          this.$snotify.success('Payment has been processed successfully!')
          await this.$router.push({ name: 'app-children' })
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
