<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-btn
          v-if="inSignUpProcess"
          color="accent"
          nuxt
          text
          :to="{
            name: 'app-payment-plan',
            query: { process: 'signup', step: '3' }
          }"
        >
          <v-icon left>
            mdi-less-than
          </v-icon>

          Back
        </v-btn>
      </v-row>

      <v-row
        class="flex-column flex-md-row mt-sm-6"
        justify="center"
        no-gutters
      >
        <v-col cols="12" class="px-12" order="first">
          <p class="text-center text-md-left">
            <span class="font-weight-bold text-h5">
              Why do we need a credit card?
            </span>
          </p>
          <p class="text-center text-md-left">
            Playgarden Prep Online is currently <span class="font-weight-bold primary--text">FREE</span> for you for the next 15 days. We need your credit card information to complete the registration process, but you will <span class="font-weight-bold">NOT</span> be charged.
          </p>
        </v-col>

        <v-col
          class="px-12 mt-1 mt-md-12"
          cols="12"
          md="8"
          lg="6"
          xl="6"
          order="3"
          order-md="2"
        >
          <stripe-form :loading="loading" @click:submit="onSubmit" />
        </v-col>

        <v-col
          class="px-12 mt-1 mt-md-12 mb-6 mb-md-12"
          cols="12"
          md="4"
          lg="6"
          xl="6"
          order="2"
          order-md="3"
        >
          <p class="text-center text-md-left">
            <span class="font-weight-bold text-h5 pg-letter-spacing">
              PROGRAM
            </span>
          </p>

          <v-row
            v-for="(item, indexCI) in cost.items"
            :key="indexCI"
            no-gutters
            class="py-2"
          >
            <v-col>
              <span class="product-name">
                {{ item.product.name }}
              </span>
            </v-col>

            <v-col cols="4" class="pr-3">
              <div class="product-description">
                {{ productValue(item) }} / {{ item.recurring.interval }}
              </div>
            </v-col>
          </v-row>

          <v-row
            v-if="coupon"
            no-gutters
          >
            <v-col class="text-right discount-label">
              <span>
                Discount
              </span>
            </v-col>
            <v-col cols="4" class="pr-3">
              <div>
                <span v-if="coupon.percent_off">
                  <b>- {{ coupon.percent_off }}%</b>
                </span>
                <span v-if="coupon.amount_off">
                  <b>${{ coupon.amount_off.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }}</b>
                </span>
              </div>
            </v-col>
          </v-row>

          <v-divider />

          <v-row class="pt-3" no-gutters>
            <v-col>
              <span class="total">
                TOTAL
              </span>
            </v-col>

            <v-col cols="4" class="text-right">
              <span v-if="!coupon" class="total-cost"> {{ (cost.total || 0).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }} </span>
              <span v-else class="total-cost"> {{ (getTotal || 0 ).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) }} </span>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <div class="due-today mt-2">
              <div>
                DUE TODAY
              </div>
              <div class="text-right">
                $0
              </div>
            </div>
            <!-- <v-col>
              <span class="due-today">
                <b>DUE TODAY</b>
              </span>
            </v-col>

            <v-col cols="4">
              <span class="due-today-total">
                <b>$0</b>
              </span>
            </v-col> -->
          </v-row>

          <div class="text-center">
            <img class="mt-4" width="65%" src="@/assets/svg/pci-dss.svg">
          </div>
        </v-col>
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
    loading: false,
    coupon: null
  }),

  computed: {
    inSignUpProcess () {
      const { query } = this.$route

      return query.process === 'signup' && query.step === '4'
    },
    getTotal () {
      let discount = 0
      if (this.coupon.amount_off) {
        discount = this.cost.total - this.coupon.amount_off
      } else {
        discount = ((this.cost.total * this.coupon.percent_off) / 100)
        discount = this.cost.total - discount
      }
      return discount
    }
  },

  created () {
    this.fetchSubCosts()
    this.$nuxt.$on('send-coupon', (coupon) => {
      this.coupon = coupon
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('send-coupon')
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('payment', [
      'fetchSubscriptionCost',
      'paySubscription',
      'validateCard'
    ]),

    productValue (value) {
      const monthlyCost = /month.*$/.test(value.recurring.interval.toLowerCase()) ? value.unit_amount / 100 : value.unit_amount / 12 / 100
      return monthlyCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    },

    async fetchSubCosts () {
      try {
        this.cost = await this.fetchSubscriptionCost()
        this.cost.items = this.cost.items.slice(0, 1)
      } catch (e) {}
    },

    async onSubmit (cardData) {
      this.loading = true

      try {
        const dataSubscrition = {
          token: cardData.token
        }

        if (cardData.promotion_id) {
          dataSubscrition.promotion_id = cardData.promotion_id
        }
        await this.paySubscription(dataSubscrition)

        if (this.inSignUpProcess) {
          await this.fetchUserInfo()
          this.$snotify.success('Registration has been completed successfully!')
          await this.$router.push({ name: 'auth-verify-email' })
        } else {
          this.$snotify.success('Plan change has been processed successfully!')
          await this.$router.push({ name: 'app-account-index' })
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.discount-label {
  margin-right: 17%;
}

.product-name {
  color: #606060;
  line-height: 1.5;
  font-size: 16px;
  letter-spacing: 1.8px;
  font-weight: 400;
}

.product-description {
  color: #606060;
  line-height: 1.5;
  font-size: 16px;
  text-align: right;
  font-weight: 500;
}

.total, .total-cost {
  color: #606060;
  line-height: 1.5;
  font-size: 22px;
  letter-spacing: 1.8px;
  font-weight: 400;
}

.due-today {
  background-color: var(--v-accent-base);
  border-radius: 8px;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.5;
  width: 100%;
  color: white;
}
</style>
