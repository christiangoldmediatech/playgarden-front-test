<template>
  <v-main>
    <v-container fluid>
      <v-row class="mb-6" no-gutters>
        <v-col cols="12">
          <!-- Back Button When Signin Up -->
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
          <!-- Default Back Button -->
          <v-btn
            v-else
            color="accent"
            class="text-none"
            nuxt
            :to="{ name: 'app-virtual-preschool' }"
            text
          >
            <v-icon left>
              mdi-less-than
            </v-icon>

            Go Back to Home
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center mt-4">
          <div>
            <underlined-title
              :text="
                isTrialExpired
                  ? 'YOUR FREE TRIAL HAS ENDED'
                  : 'YOUR FREE TRIAL WILL END ON:'
              "
              font-size="38px"
              font-size-mobile="28px"
            />
          </div>
          <div class="py-3">
            <underlined-title
              :text="lastDayOfTrial"
              class="primary--text"
              line-color="rgba(178, 230, 141, 0.3)"
              :line-from="40"
              padding-bottom="20px"
            />
          </div>
          <div class="mt-8 mb-4 text-body-1 text-md-h5 custom-max-width">
            During your trial period, you are able to experience the
            <span class="accent--text font-weight-bold">Premium+ plan</span>.
            After your trial period ends, you will be automatically placed in
            the
            <span class="accent--text font-weight-bold">Premium</span> monthly
            plan. You can choose to stay in that plan, or you can choose a new
            plan below. As always, you can cancel your account at any time by
            going to your
            <nuxt-link
              class="accent--text text-decoration-underline"
              :to="{ name: 'app-account-index' }"
            >
              Accounts Page
            </nuxt-link>
            under Membership.
          </div>
          <v-btn
            large
            color="accent"
            nuxt
            :to="{ name: 'app-virtual-preschool' }"
          >
            REMIND ME LATER
          </v-btn>
        </v-col>
        <v-col cols="12" class="mt-8">
          <subscription-plan-selection
            class="mt-md-n6"
            @click:submit="onSubmit"
            @initialized="initialized = true"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Set Payment Method modal -->
    <pg-dialog
      v-model="isPaymentMethodModalVisible"
      content-class="white"
      :fullscreen="isMobile"
      max-width="700px"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3 mb-md-n12 mt-1" justify="start">
          <v-btn
            text
            class="accent--text text-none"
            @click="handlePaymentModalBackButton"
          >
            <v-icon left>
              mdi-chevron-left
            </v-icon>
            Back to choose plan
          </v-btn>
        </v-row>

        <v-card flat class="mx-4 mt-12 mb-4">
          <stripe-pay-form
            button-text="Start Learning"
            :cancelable="false"
            :is-free-for-days-text-visible="false"
            :loading="isPaymentMethodModalLoading"
            @click:submit="handlePaymentFormSubmit"
          >
            <template #header>
              <center class="pt-6">
                <underlined-title
                  class="text-h6 text-md-h5"
                  text="CREDIT CARD INFORMATION"
                />
              </center>
              <center class="grey--text text--darken-1 my-6 text-body-2">
                We need your credit card information to confirm who you are.
              </center>
            </template>
            <template #footer>
              <center>
                <div
                  class="font-weight-bold grey--text text--darken-1 mt-6 mb-2 text-body-2"
                >
                  You can cancel your trial and membership anytime from the
                  account settings.
                </div>
              </center>
            </template>
          </stripe-pay-form>
        </v-card>
      </v-col>
    </pg-dialog>
  </v-main>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters, mapActions } from 'vuex'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import StripePayForm from '@/components/forms/payment/StripePayForm.vue'

import { UserFlow } from '@/models'

export default {
  name: 'Plan',

  components: {
    SubscriptionPlanSelection,
    StripePayForm
  },

  data: () => ({
    initialized: false,
    isPaymentMethodModalVisible: false,
    isPaymentMethodModalLoading: false
  }),

  computed: {
    ...mapGetters('auth', ['getUserInfo']),

    inSignUpProcess() {
      const { query } = this.$route

      return query.process === 'signup' && query.step === '3'
    },

    isTrialExpired() {
      return dayjs().isAfter(this.getUserInfo.trialEnd)
    },

    lastDayOfTrial() {
      if (!this.getUserInfo.trialEnd) {
        return ''
      }

      return dayjs(this.getUserInfo.trialEnd).format('MMMM DD, YYYY')
    },

    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),
    ...mapActions('payment', ['fetchBillingCards', 'addBillingCard']),

    async onSubmit() {
      try {
        if (this.inSignUpProcess) {
          await this.fetchUserInfo()

          await this.$router.push({
            name: 'app-payment-register',
            query: { process: 'signup', step: '4' }
          })
        }

        await this.$store.dispatch('admin/users/setPlanChoosen')
        await this.$store.commit(
          'notifications/SET_TRIAL_EXPIRING_RIBBON_VISIBLE',
          false
        )

        /**
         * Show billing modal is the following criteria is met:
         * -- The use flow is NOCREDITCARD
         * -- The user has not added any cards
         */
        const userCards = await this.fetchBillingCards()

        if (
          this.getUserInfo.flow === UserFlow.NOCREDITCARD &&
          userCards &&
          userCards.length === 0
        ) {
          this.isPaymentMethodModalVisible = true
        }
      } catch (e) {}
    },

    handlePaymentModalBackButton() {
      this.isPaymentMethodModalVisible = false
    },

    async handlePaymentFormSubmit(cardData) {
      this.isPaymentMethodModalLoading = true

      try {
        const dataSubscrition = {
          token: cardData.token,
          sendEmail: true
        }

        if (cardData.promotion_id) {
          dataSubscrition.promotion_id = cardData.promotion_id
        }

        await this.addBillingCard(dataSubscrition)

        this.$snotify.success('Payment method added!')

        await this.$router.push({
          name: 'app-virtual-preschool'
        })
      } catch (e) {
      } finally {
        this.isPaymentMethodModalLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-max-width {
  margin: auto;
  max-width: 1395px !important;
}
</style>
