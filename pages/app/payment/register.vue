<template>
  <v-row class="flex-column-reverse flex-md-row" justify="center" no-gutters>
    <v-col class="px-12" cols="12" lg="6" md="8" xl="5">
      <stripe-form :loading="loading" @click:submit="onSubmit" />
    </v-col>

    <v-col class="px-12" cols="12" lg="6" md="4" xl="3">
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
        <v-col cols="8">
          <span class="product-name">
            {{ item.product.name }}
          </span>
        </v-col>
        <v-col cols="4">
          <p class="product-description">
            <b class="product-price">${{ item.unit_amount / 100 }}</b>
            <br />
            <span class="product-info"> a year <br /> <span class="product-info-1">*Pricing is per child</span></span>
          </p>
        </v-col>
      </v-row>

      <v-divider />

      <v-row class="px-12">
        <v-col cols="9">
          <span class="due-today">
            TOTAL
          </span>
          <br />
          <span class="due-today">
            DUE TODAY
          </span>
        </v-col>
        <v-col cols="3">
          <b class="total-membership">${{ cost.total || 0 }}</b>
          <b class="total-membership">${{ 0 }}</b>
        </v-col>
      </v-row>
      <v-row class="px-12">
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

      return query.process === 'signup' && query.step === '4'
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
        this.cost.items = this.cost.items.slice(0, 1)
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

<style>
.product-name {
  text-transform: uppercase !important;
}

.product-price {
  font-size: 30px;
}

.product-info {
  font-size: 14px;
}
.product-info-1 {
  font-size: 9px;
}

.product-description {
  text-align: center;
}

.total-membership {
  font-size: 30px;
}

.due-today {
  color: $pg-black !important;
  font-weight: bold;
}
</style>
