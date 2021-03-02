<template>
  <v-row no-gutters>
    <v-col>
      <v-row
        no-gutters
      >
        <v-col
          class="px-12 mt-1 mt-md-12"
          cols="12"
          md="6"
          lg="6"
          xl="6"
        >
          <stripe-pay-form :loading="loading" @click:submit="onSubmit" />
        </v-col>
        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
        >
          <template>
            <v-row v-if="!showCardPlaygarden">
              <v-col cols="12">
                <v-btn
                  block
                  text
                  @click="showCardPlaygarden = !showCardPlaygarden"
                >
                  <span :class="($vuetify.breakpoint.smAndUp) ? 'free-trial' : 'free-trial-mobile'">
                    Our family loves Playgarden <br />Prep Online!
                  </span>
                  <v-icon class="ml-2">
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
                <v-divider class="mt-4 mb-4"></v-divider>
              </v-col>
            </v-row>
            <v-row :class="($vuetify.breakpoint.smAndUp) ? 'background-card' : 'background-card-mobile pt-14 px-8'">
              <v-col cols="12" :class="(!$vuetify.breakpoint.smAndUp) ? 'text-center' : 'mt-14 mb-8 px-10'">
                <v-layout row wrap align-center justify-center>
                  <v-card class="elevation-0 mx-10">
                    <v-container>
                      <v-layout column align-center justify-center>
                        <card-playgarden v-if="showCardPlaygarden" />
                        <card-info v-else />
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                  block
                  text
                  @click="showCardPlaygarden = !showCardPlaygarden"
                >
                  <img
                    src="@/assets/png/gift-icon.png"
                    class="mr-2"
                    width="18px"
                  >
                  <span :class="($vuetify.breakpoint.smAndUp) ? 'free-trial' : 'free-trial-mobile'">
                    GET 30 DAYS OF FREE TRIAL
                  </span>
                  <v-icon v-if="showCardPlaygarden" class="ml-2">
                    mdi-chevron-up
                  </v-icon>
                  <v-icon v-else class="ml-2">
                    mdi-chevron-down
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
import CardPlaygarden from './CardPlaygarden'
import CardInfo from './CardInfo'
export default {
  name: 'StepTwo',

  components: {
    StripePayForm,
    CardPlaygarden,
    CardInfo
  },

  data: () => ({
    loading: false,
    showCardPlaygarden: true,
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
        name: 'app-children',
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
.free-trial {
  font-size: 22px !important;
}
.free-trial-mobile {
  font-size: 14px !important;
}
</style>
