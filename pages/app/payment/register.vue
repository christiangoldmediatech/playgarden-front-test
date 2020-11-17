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
        class="flex-column-reverse flex-md-row"
        justify="center"
        no-gutters
      >
        <v-col class="px-12" cols="12" lg="6" md="8" xl="6">
          <stripe-form :loading="loading" @click:submit="onSubmit" />
        </v-col>

        <v-col class="px-12" cols="12" lg="6" md="4" xl="6">
          <p class="text-center text-md-left">
            <span class="font-weight-bold text-h5 pg-letter-spacing">
              MEMBERSHIP REVIEW
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
                <span class="product-price">
                  ${{ item.unit_amount / 100 }}
                </span>

                <span class="product-info">
                  / {{ productPeriod(item.product.name) }}
                </span>

                <br>

                <span class="product-info-1">*Pricing is per child</span>
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
                  <b>- {{ coupon.percent_off }} %</b>
                </span>
                <span v-if="coupon.amount_off">
                  <b>${{ coupon.amount_off.toLocaleString("en-US") }}</b>
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

            <v-col cols="4">
              <span v-if="!coupon" class="total-cost"> ${{ cost.total || 0 }} </span>
              <span v-else class="total-cost"> ${{ getTotal || 0 }} </span>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <span class="due-today">
                <b>DUE TODAY</b>
              </span>
            </v-col>

            <v-col cols="4">
              <span class="due-today-total">
                <b>$0</b>
              </span>
            </v-col>
          </v-row>
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

    productPeriod (name = '') {
      return /month.*$/.test(name.toLowerCase()) ? 'month' : 'year'
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
        const token = await this.validateCard(cardData)
        const dataSubscrition = (cardData.promotion_id) ? { ...token, promotion_id: cardData.promotion_id } : token

        await this.paySubscription(dataSubscrition)

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

<style lang="scss" scoped>
.product-info {
  font-size: 14px !important;
}

.discount-label {
  margin-right: 17%;
}

.product-info-1 {
  font-size: 9px !important;
}

.product-description {
  line-height: 1.1 !important;
}

.due-today,
.due-today-total,
.product-price,
.total,
.total-cost {
  font-size: 20px !important;
}
</style>
