<template>
  <v-row no-gutters>
    <v-col>
      <v-row
        no-gutters
      >
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
            <v-row class="background-card">
              <v-col cols="12" :class="(!$vuetify.breakpoint.smAndUp) ? 'ml-10' : 'mt-14 mb-8'">
                <v-layout row wrap align-center justify-center>
                  <v-card class="elevation-0">
                    <v-container>
                      <v-layout column align-center justify-center>
                        <v-card-title primary-title>
                          <h4>Our family loves Playgarden Prep Online!</h4>
                        </v-card-title>
                        <v-card-text>
                          <div class="text-mdi-monitor">
                            <center class="text-pay-information">
                              “We have seen Liam learn a lot through the platform <br />
                              and appreciate your team creating it during this time. <br />
                              Features we love:

                              <div v-if="!showDetailFreeTrial">
                                <v-row>
                                  <ul>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        Workbook exercises
                                      </small>
                                    </li>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        Library (Liam has many favorites)
                                      </small>
                                    </li>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        Liam looks forward to cooking and reading with Miss Lucy so much”
                                      </small>
                                    </li>
                                  </ul>
                                </v-row>
                              </div>
                              <h6
                                class="font-weight-bold
                                mt-3"
                              >
                                - Mother of 3 year old Liam
                              </h6>
                            </center>
                          </div>
                        </v-card-text>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                  v-if="$vuetify.breakpoint.smAndUp"
                  block
                  text
                  @click="showDetailFreeTrial = !showDetailFreeTrial"
                >
                  <img
                    src="@/assets/png/gift-icon.png"
                    class="mr-2"
                    width="18px"
                  >
                  <span class="free-trial">
                    GET 30 DAYS OF FREE TRIAL
                  </span>
                  <v-icon v-if="showDetailFreeTrial" class="ml-2">
                    mdi-chevron-down
                  </v-icon>
                  <v-icon v-else class="ml-2">
                    mdi-chevron-up
                  </v-icon>
                </v-btn>
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
    loading: false,
    showDetailFreeTrial: false,
    coupon: null
  }),

  computed: {},

  created () {},

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('payment', [
      'payShorterSubscription',
      'validateCard'
    ]),

    goToStepThree () {
      this.$router.push({
        name: 'app-children-shorter',
        query: {
          step: 3,
          process: 'signup'
        }
      })
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
        await this.payShorterSubscription(dataSubscrition)
        this.goToStepThree()
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
  font-size: 24px !important;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}
.text-trial {
  margin-top: 11px;
  position: absolute;
}

.free-trial {
  font-size: 22px !important;
}

.text-pay-information {
  font-size: 12px;
  font-style: italic;
}
</style>
