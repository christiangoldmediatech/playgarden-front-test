<template>
  <v-row no-gutters>
    <v-col>
      <v-row
        no-gutters
      >
        <v-col cols="12">
          <v-btn
            v-if="!$vuetify.breakpoint.smAndUp"
            block
            text
            @click="showWhyDo = !showWhyDo"
          >
            Why do we need a credit card?
            <v-icon v-if="showWhyDo" class="ml-2">
              mdi-chevron-down
            </v-icon>
            <v-icon v-else class="ml-2">
              mdi-chevron-up
            </v-icon>
          </v-btn>
          <p v-else class="text-center text-md-left">
            <span class="font-weight-bold text-h5">
              Why do we need a credit card?
            </span>
          </p>
          <p v-if="!showWhyDo" class="text-center text-md-left">
            Playgarden Prep Online is currently <span class="font-weight-bold primary--text">FREE</span> for you for the next 30 days. We need your credit card information to complete the registration process, but you will <span class="font-weight-bold">NOT</span> be charged.
          </p>
          <v-divider v-if="!$vuetify.breakpoint.smAndUp" class="ml-3 mr-3" />
        </v-col>

        <v-col
          class="px-12 mt-1 mt-md-12"
          cols="12"
          md="5"
          lg="6"
          xl="6"
        >
          <stripe-pay-form :loading="loading" @click:submit="onSubmit" />
        </v-col>
        <v-col
          cols="12"
          md="8"
          lg="6"
        >
          <template>
            <v-btn
              block
              text
              v-if="!$vuetify.breakpoint.smAndUp"
              @click="showDetailFreeTrial = !showDetailFreeTrial"
            >
              <img
                src="@/assets/png/gift-icon.png"
                class="clickable mr-2"
                width="18px"
              >
              GET 30 DAYS OF FREE TRIAL
              <v-icon v-if="showDetailFreeTrial" class="ml-2">
                mdi-chevron-down
              </v-icon>
              <v-icon v-else class="ml-2">
                mdi-chevron-up
              </v-icon>
            </v-btn>
            <v-row no-gutters>
              <v-col cols="12">
                <v-row>
                  <v-col>
                    <img
                      v-if="$vuetify.breakpoint.smAndUp"
                      src="@/assets/png/gift-icon.png"
                      class="clickable mr-2"
                      width="18px"
                    >
                    <span
                      v-if="$vuetify.breakpoint.smAndUp"
                      class="font-weight-bold text-uppercase pg-letter-spacing-subtitle"
                    >
                      GET 30 DAYS OF FREE TRIAL
                    </span>
                  </v-col>
                </v-row>
                <underlined-title
                  v-if="$vuetify.breakpoint.smAndUp"
                  class="text-h6 text-md-h5 mt-4"
                  text="Home School"
                />
              </v-col>
              <v-col cols="12" :class="(!$vuetify.breakpoint.smAndUp) ? 'ml-10' : ''">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                    sm="12"
                    xs="12"
                  >
                    <div v-if="!showDetailFreeTrial">
                      <v-row no-gutters>
                        <span class="font-weight-bold mt-3">That includes:</span>
                      </v-row>
                      <v-row>
                        <ul>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Over 1,200 Lessons
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              A Library with Hours of Educational Content
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Daily and Weekly Lesson Plans
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Live Zoom Enrichment Classes
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              A Complete School Year of Preschool
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Virtual Graduation
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Parent Progress Report
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Multiple Student Users
                            </small>
                          </li>
                        </ul>
                      </v-row>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                    sm="12"
                    xs="12"
                  >
                    <div v-if="!showDetailFreeTrial" :class="(!$vuetify.breakpoint.smAndUp) ? 'mt-n8' : 'mt-8'">
                      <v-row>
                        <ul>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Workbooks Shipped to Home
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              DIY Educational Materials
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Age-appropriate Pencils
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Graduation Diplomas
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Playdates for Socialization with Friends
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Playgarden Prep Backpack
                            </small>
                          </li>
                          <li
                            class="register-item text-left"
                          >
                            <small class="text-trial">
                              Monthly Parent Consultation with Playgarden Prep NYC Teachers
                            </small>
                          </li>
                        </ul>
                      </v-row>
                    </div>
                  </v-col>
                  <v-col v-if="$vuetify.breakpoint.smAndUp" cols="12">
                    <center>
                      <h6
                        class="font-weight-bold
                        mt-3"
                      >
                        *You can cancel you membership any time from the account settings.
                      </h6>
                    </center>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import StripePayForm from '@/components/forms/payment/StripePayForm'

export default {
  name: 'StepTwo',

  components: {
    StripePayForm
  },

  data: () => ({
    cost: {},
    loading: false,
    showDetailFreeTrial: false,
    showWhyDo: false,
    coupon: null
  }),

  computed: {
    /* inSignUpProcess () {
      const { query } = this.$route

      return query.process === 'signup' && query.step === '4'
    }, */
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
    /* this.showWhyDo = (!this.$vuetify.breakpoint.smAndUp)
    this.showDetailFreeTrial = (!this.$vuetify.breakpoint.smAndUp) */
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

.image {
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    max-width: 90%;
  }
  &.mobile {
    max-height: 250px;
  }
}
.text-orange-info {
  background-color: var(--v-accent-base) !important;
  color: var(--v-white-base) !important;
  height: 19px;
  font-size: 15px;
}
.text-orange-info::v-deep.v-chip .v-chip__content {
  color: var(--v-white-base) !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3.15px;
  line-height: 1.48;
  background-color: var(--v-accent-base) !important;
}
.text-orange-info::v-deep.v-chip--label {
  border-radius: 0px !important;
}
ul {
  list-style: none; /* Remove default bullets */
}
ul li::before {
  content: "●";
  font-size: 24px;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
}
.text-trial {
  margin-top: 11px;
  position: absolute;
}
</style>
