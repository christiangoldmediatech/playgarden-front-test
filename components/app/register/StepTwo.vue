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
            <v-row :class="($vuetify.breakpoint.smAndUp) ? 'background-card' : 'background-card-mobile pt-14'">
              <v-col cols="12" :class="(!$vuetify.breakpoint.smAndUp) ? 'text-center' : 'mt-14 mb-8'">
                <v-layout row wrap align-center justify-center>
                  <v-card class="elevation-0">
                    <v-container>
                      <v-layout column align-center justify-center>
                        <v-card-title primary-title>
                          <h4 v-if="$vuetify.breakpoint.smAndUp">
                            Our family loves Playgarden Prep Online!
                          </h4>
                          <v-btn
                            v-else
                            block
                            text
                            @click="changeShowDetail"
                          >
                            <span class="free-trial-info">
                              Our family loves Playgarden <br /> Prep Online!
                            </span>
                            <v-icon v-if="showDetailFreeTrial" class="hidden-md-only hidden-lg-only">
                              mdi-menu-down
                            </v-icon>
                            <v-icon v-else class="hidden-md-only hidden-lg-only">
                              mdi-menu-up
                            </v-icon>
                          </v-btn>
                        </v-card-title>
                        <v-card-text v-if="!showDetailFreeTrial">
                          <div class="text-mdi-monitor">
                            <center class="text-pay-information">
                              “We have seen Liam learn a lot through the platform <br />
                              and appreciate your team creating it during this time. <br />
                              Features we love:

                              <div class="pb-10">
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
                              <span
                                class="info-mother
                                mt-8"
                              >
                                - Mother of 3 year old Liam
                              </span>
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
              <v-col v-if="!showDetailThatIncludes" cols="12">
                <v-btn
                  block
                  text
                  @click="showDetailThatIncludes = !showDetailThatIncludes"
                >
                  <img
                    src="@/assets/png/gift-icon.png"
                    class="mr-2"
                    width="18px"
                  >
                  <span class="free-trial">
                    GET 30 DAYS OF FREE TRIAL
                  </span>
                  <v-icon class="ml-2">
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="showDetailThatIncludes" :class="($vuetify.breakpoint.smAndUp) ? 'mt-4 background-card' : 'background-card-mobile pt-14'">
              <v-col cols="12" :class="(!$vuetify.breakpoint.smAndUp) ? '' : 'mt-10 mb-10 pl-8 pr-8'">
                <v-layout row wrap align-center justify-center>
                  <v-card class="elevation-0">
                    <v-container>
                      <v-layout column align-center justify-center>
                        <v-card-title primary-title>
                          <v-btn
                            block
                            text
                            @click="showDetailThatIncludes = !showDetailThatIncludes"
                          >
                            <img
                              src="@/assets/png/gift-icon.png"
                              class="mr-2"
                              width="18px"
                            >
                            <span class="free-trial">
                              GET 30 DAYS OF FREE TRIAL
                            </span>
                            <v-icon class="hidden-md-only hidden-lg-only">
                              mdi-menu-up
                            </v-icon>
                          </v-btn>
                        </v-card-title>
                        <v-card-text>
                          <div class="text-mdi-monitor">
                            <center class="text-pay-get">
                              <div>
                                <v-row>
                                  <span class="font-weight-bold ml-2">That includes:</span>
                                </v-row>
                                <v-row>
                                  <ul>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        A Daily Learning Schedule
                                      </small>
                                    </li>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        Access to over 1,200 lessons
                                      </small>
                                    </li>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        Live Classes with Playgarden Prep Teachers
                                      </small>
                                    </li>
                                  </ul>
                                </v-row>
                              </div>
                              <v-row justify="center">
                                <v-col cols="3">
                                  <v-btn
                                    block
                                    class="mt-4 info-much-more"
                                  >
                                    <span class="much-info">
                                      AND MUCH MORE!!
                                    </span>
                                  </v-btn>
                                </v-col>
                                <span
                                  class="mt-2 text-header-info"
                                >
                                  *You can cancel you membership any time from the account settings.
                                </span>
                              </v-row>
                            </center>
                          </div>
                        </v-card-text>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
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
    showDetailThatIncludes: false,
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

    changeShowDetail () {
      if (!this.$vuetify.breakpoint.smAndUp) {
        this.showDetailFreeTrial = !this.showDetailFreeTrial
      }
    },

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
  font-size: 14px !important;
  position: absolute;
}

.text-pay-information {
  font-size: 14px !important;
}

.free-trial {
  font-size: 22px !important;
}

.info-mother {
  color: #A6A6A6 !important;
}

.much-info {
  color: var(--v-accent-base);
}

.info-much-more {
  background-color: rgba(248, 152, 56, 0.3) !important;
}

.text-pay-information {
  font-size: 12px;
  font-style: italic;
}

.text-pay-get {
  font-size: 12px;
}
</style>
