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
        <v-col cols="12" class="text-center mt-4 mb-10">
          <!-- USER IN TRIAL -->
          <div v-if="isUserInTrial">
            <div>
              <underlined-title
                text="END YOUR TRIAL PERIOD EARLY"
                font-size="44px"
                class="pg-text-pg-grey"
                font-size-mobile="32px"
              />
            </div>

            <div class="pg-leading-[36px] mt-8 mb-4 text-body-1 text-md-h5 custom-max-width">
              Your trial period ends on
              <underlined-title
                :text="lastDayOfTrial"
                :line-from="50"
                font-size="32px"
                font-size-mobile="22px"
                class="primary--text"
                line-color="rgba(178, 230, 141, 0.3)"
                padding-bottom="20px"
              />
              . However, by finishing it before and selecting one of our plans, you will be able
              to access our playdates and more!
            </div>
          </div>

          <!--  PAYING USER -->
          <div v-else>
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
          </div>

          <template v-if="!plansShown">
            <v-btn
              color="#68C453"
              class="px-16"
              dark
              @click="showPlans"
            >
              CHOOSE A PLAN
            </v-btn>
            <br>
            <br>
          </template>

          <nuxt-link
            v-if="!isTrialExpired"
            class="accent--text text-decoration-underline text-h5"
            :to="{ name: 'app-virtual-preschool' }"
          >
            REMIND ME LATER
          </nuxt-link>
        </v-col>
        <v-col v-if="plansShown" id="plansSection" cols="12" class="mt-8">
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
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { mapGetters, mapActions } from 'vuex'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import StripePayForm from '@/components/forms/payment/StripePayForm.vue'

import { UserFlow } from '@/models'
import { useAuth } from '@/composables'

export default defineComponent({
  name: 'Plan',

  components: {
    SubscriptionPlanSelection,
    StripePayForm
  },

  setup() {
    const store = useStore()
    const Auth = useAuth({ store })

    return {
      isUserInTrial: Auth.isUserInTrial
    }
  },

  data: () => ({
    initialized: false,
    isPaymentMethodModalVisible: false,
    isPaymentMethodModalLoading: false,
    plansShown: false
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

  created () {
    if (this.getUserInfo.role.id === 4) {
      this.$router.push({
        name: 'app-account-index'
      })
    }
  },

  mounted () {
    if (this.isTrialExpired) {
      this.plansShown = true
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
         * -- The user did not add any cards
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
    },

    showPlans() {
      this.plansShown = true
      this.$nextTick(() => {
        this.$vuetify.goTo('#plansSection')
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.custom-max-width {
  margin: auto;
  max-width: 1395px !important;
}
</style>
