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
            <v-row :class="($vuetify.breakpoint.smAndUp) ? '' : 'pt-1 px-8'">
              <v-col cols="12" :class="(!$vuetify.breakpoint.smAndUp) ? 'text-center' : 'mt-1 mb-8 px-10'">
                <v-layout row wrap align-center justify-center>
                  <v-card class="elevation-2 mx-10">
                    <v-container>
                      <v-layout column align-center justify-center>
                        <card-playgarden />
                        <card-know-more v-if="!showCardPlaygarden" @toggleCard="showCardPlaygarden = !showCardPlaygarden" />
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="showCardPlaygarden" cols="12" class="mt-4">
                <v-btn
                  block
                  text
                  @click="showCardPlaygarden = !showCardPlaygarden"
                >
                  <p>
                    <span :class="($vuetify.breakpoint.smAndUp) ? 'free-trial' : 'free-trial-mobile'">
                      WANT TO KNOW MORE ABOUT
                    </span> <br>
                    <span :class="($vuetify.breakpoint.smAndUp) ? 'free-trial' : 'free-trial-mobile'">
                      YOUR FREE TRIAL ?
                    </span>
                  </p>
                  <v-icon class="ml-2">
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col v-if="!$vuetify.breakpoint.smAndUp" cols="12">
                <div>
                  <p>
                    <center>
                      <span class="font-weight-bold text-completely">
                        Playgarden Prep Online is COMPLETELY FREE for the next 30 days.
                      </span>
                    </center>
                  </p>
                  <v-divider />
                  <p>
                    <center class="ml-2">
                      <span class="info-pay">
                        You can cancel your trial and membership anytime from the account settings.<br> Once your free trial ends you will be placed on the <span class="option-standar">Standard</span> monthly plan, you can change plans at any time in your profile page.
                      </span>
                    </center>
                  </p>
                </div>
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
import {
  defineComponent,
  useRoute
} from '@nuxtjs/composition-api'

import { useUTM } from '@/composables/use-utm.composable'

import StripePayForm from '@/components/forms/payment/StripePayForm'
import CardPlaygarden from './CardPlaygarden'
import CardKnowMore from './CardKnowMore'

export default defineComponent({
  name: 'StepTwo',

  components: {
    StripePayForm,
    CardPlaygarden,
    CardKnowMore
  },

  data: vm => ({
    loading: false,
    showCardPlaygarden: true,
    coupon: null,
    mode: vm.$route.params.mode
      ? vm.$route.params.mode
      : ''
  }),

  setup() {
    const route = useRoute()
    const utmContent = useUTM({ route: route.value })

    return {
      utmContent
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('payment', [
      'payShorterSubscription',
      'validateCard'
    ]),

    async goToStepThree () {
      let page = {}
      if (this.mode === 'activate-user') {
        await this.fetchUserInfo()
        page = {
          name: 'app-account-index'
        }
      } else {
        page = {
          name: 'app-children',
          query: {
            step: 3,
            process: 'signup',
            ...this.utmContent
          }
        }
      }
      this.$router.push(page)
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
})
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
.text-completely {
  font-size: 12px !important;
  color: rgba(96, 96, 96, 0.8) !important;
}
.list-scroll {
  max-height: 500px;
  overflow-y: auto !important;
}
.info-pay {
  font-size: 12px;
  font-weight: 500;
  color: rgba(96, 96, 96, 0.8) !important;
  text-align: center;
}
</style>
