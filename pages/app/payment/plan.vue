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
            :to="{ name: 'app-dashboard' }"
            text
          >
            <v-icon left>
              mdi-less-than
            </v-icon>

            Go Back to Lessons
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-center mt-4">
          <div>
            <underlined-title
              :text="isTrialExpired ? 'YOUR TRIAL PERIOD HAS EXPIRED.':'YOUR TRIAL PERIOD IS EXPIRING.'"
              font-size="38px"
              font-size-mobile="28px"
            />
          </div>
          <div class="py-3">
            <div class="text-h5 grey--text text--darken-2 font-weight-bold my-4">
              {{ isTrialExpired ? 'Your last day was:':'Your last day is:' }}
            </div>
            <underlined-title
              :text="lastDayOfTrial"
              class="primary--text"
              line-color="rgba(194, 218, 165, 0.18)"
              :line-from="35"
              padding-bottom="30px"
            />
          </div>
          <div class="mt-8 mb-4 text-body-1 text-md-h5 custom-max-width">
            During your trial period, which {{ isTrialExpired ? 'ended':'will end' }} on {{ lastDayOfTrial }}, you were able to experience all the features of the <span class="accent--text font-weight-bold">HOMESCHOOL</span> plan. After the trial period, you {{ isTrialExpired ? 'were':'will be' }} automatically placed in the <span class="accent--text font-weight-bold">PREMIUM EDUCATION</span> monthly plan. You can stay in that plan, or you can choose now in which plan you want your little one to learn going forward.
            As always, you can cancel your enrollment anytime by going to your Accounts Page.
          </div>
          <v-btn
            large
            color="accent"
            nuxt
            :to="{ name: 'app-dashboard' }"
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
  </v-main>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters, mapActions } from 'vuex'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'

export default {
  name: 'Plan',

  components: {
    SubscriptionPlanSelection
  },

  data: () => ({
    initialized: false
  }),

  computed: {
    ...mapGetters('auth', ['getUserInfo']),

    inSignUpProcess () {
      const { query } = this.$route

      return query.process === 'signup' && query.step === '3'
    },

    isTrialExpired () {
      return dayjs().isAfter(this.getUserInfo.trialEnd)
    },

    lastDayOfTrial () {
      if (!this.getUserInfo.trialEnd) {
        return ''
      }

      return dayjs(this.getUserInfo.trialEnd).format('MMMM DD, YYYY')
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    async onSubmit () {
      try {
        if (this.inSignUpProcess) {
          await this.fetchUserInfo()

          await this.$router.push({
            name: 'app-payment-register',
            query: { process: 'signup', step: '4' }
          })
        }

        await this.$store.dispatch('admin/users/setPlanChoosen')
        await this.$store.commit('notifications/SET_TRIAL_EXPIRING_RIBBON_VISIBLE', false)
        await this.$router.push({
          name: 'app-dashboard'
        })
      } catch (e) {
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
