<template>
  <v-main class="background-card-learn-play">
    <v-container fluid>
      <v-row class="mb-6" no-gutters>
        <v-col cols="12" class="mt-4">
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

        <v-col v-if="!trialEndedTooLongAgo" cols="12" class="text-center mt-4">
          <div
            class="pg-text-4xl pg-text-primary pg-font-bold pg-tracking-[1px] v2-font"
          >
            {{
              isTrialExpired
                ? 'YOUR TRIAL PERIOD HAS EXPIRED'
                : 'YOUR TRIAL PERIOD IS EXPIRING'
            }}
          </div>

          <div class="mt-8 mb-6 text-body-1 text-md-h5 custom-max-width">
            Your trial period
            {{ isTrialExpired ? 'ended' : 'will end' }} on
            <span class="pg-text-primary pg-font-semibold v2-font">
              {{ lastDayOfTrial }}.
            </span>
            You {{ isTrialExpired ? 'were' : 'are currently' }} trialing the
            <span class="accent--text font-weight-bold">
              {{ getUserInfo.planSelected.name }}
            </span> plan. After your trial
            {{ isTrialExpired ? 'ended' : 'ends' }} you
            {{ isTrialExpired ? 'were' : 'will be' }} automatically placed into
            the
            <span class="accent--text font-weight-bold">
              {{ getUserInfo.planSelected.name }}
            </span> monthly plan.
            If you would like to trial a different plan, you may do so below!
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

    trialEndedTooLongAgo() {
      return (
        this.isTrialExpired &&
        dayjs().diff(dayjs(this.getUserInfo.trialEnd), 'days') > 30
      )
    },

    isMobile() {
      return this.$vuetify.breakpoint.mobile
    }
  },

  created() {
    if (this.getUserInfo.role.id === 4) {
      this.$router.push({
        name: 'app-account-index'
      })
    }
  },

  mounted() {
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
      } finally {
        await this.fetchUserInfo()
      }
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
  color: #b2e68d;
}
</style>
