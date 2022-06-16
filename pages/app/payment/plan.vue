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
              :text="isTrialExpired ? 'YOUR TRIAL PERIOD HAS EXPIRED':'YOUR TRIAL PERIOD IS EXPIRING'"
              font-size="38px"
              font-size-mobile="28px"
              font-weight="900"
            />
          </div>

          <div class="mt-8 mb-6 text-body-1 text-md-h5 custom-max-width">
            During your trial period, which {{ isTrialExpired ? 'ended':'will end' }} on
            <underlined-title
              :text="lastDayOfTrial"
              class="date-expiring-color"
              line-color="rgba(178, 230, 141, 0.25)"
              :line-from="32"
              padding-bottom="10px"
              font-size="32px"
              line-padding-left="6px"
              line-padding-right="6px"
            />, you were able to experience all the features of the <span class="accent--text font-weight-bold">Preschool @ home</span> plan. After the trial period, you {{ isTrialExpired ? 'were':'will be' }} automatically placed in the <span class="accent--text font-weight-bold">Learn & Play</span> monthly plan. If you liked what you had until now, please upgrade to the <span class="font-weight-bold">Prechool @ home</span> plan.
          </div>
        </v-col>

        <v-col cols="12" class="mt-16">
          <subscription-plan-selection
            class="mt-md-n6"
            @click:submit="onSubmit"
            @initialized="initialized = true"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import dayjs from 'dayjs'
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { mapGetters, mapActions } from 'vuex'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import StripePayForm from '@/components/forms/payment/StripePayForm.vue'

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

    isTrialEndedTooLongAgo() {
      return this.isTrialExpired &&
        dayjs().diff(dayjs(this.getUserInfo.trialEnd), 'days') > 30
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
      } catch (e) {}
    },

    handlePaymentFormSubmit() {
      this.$router.push({
        name: 'app-virtual-preschool'
      })
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

.date-expiring-color {
  color: #B2E68D;
}
</style>
