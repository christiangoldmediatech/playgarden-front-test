<template>
  <v-row no-gutters>
    <v-col cols="12">
      <p class="font-weight-bold">
        MEMBERSHIP
      </p>

      <p class="mb-6">
        Your next billing date is

        <b>{{ billing.nextBillingDate }}</b>
      </p>

      <p class="mb-4">
        Your {{ membershipInterval }} membership fee is

        <b>${{ billing.planAmount }}</b>
      </p>

      <template>
        <v-row align="center" class="mb-2" no-gutters>
          <v-col class="text-truncate">
            Plan: <b>{{ billing.planName }}</b>
          </v-col>

          <v-btn color="primary" text @click="changePlanModal = true">
            CHANGE PLAN
          </v-btn>
        </v-row>
      </template>

      <v-row
        v-for="(card, indexUC) in userCards"
        :key="indexUC"
        align="center"
        class="mb-2"
        no-gutters
      >
        <v-col class="text-truncate">
          <span class="font-weight-bold">
            {{ card.details.brand }} .... .... .... {{ card.details.last4 }}
          </span>
        </v-col>

        <v-btn color="primary" text @click="onUpdateCard(card)">
          UPDATE PAYMENT
        </v-btn>
      </v-row>

      <v-row
        v-if="hasMembership"
        align="center"
        class="my-1"
        justify="end"
        no-gutters
      >
        <!-- Cancel suscription -->
        <v-btn color="accent" text @click="removeSubscription">
          CANCEL MEMBERSHIP
        </v-btn>
      </v-row>

      <div v-else class="my-6 text-center">
        <nuxt-link :to="{ name: 'app-payment-register' }">
          CREATE MEMBERSHIP
        </nuxt-link>
      </div>
    </v-col>

    <v-dialog
      v-model="stripeCardModal"
      content-class="white"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="1000"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3" justify="end">
          <v-btn icon @click.stop="stripeCardModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <v-row class="px-6">
          <v-col>
            <update-billing-method
              v-if="stripeCardModal"
              :card-id="cardToUpate.id"
              no-terms
              no-trial
              @update:success="onSuccessUpdateBilling"
              @click:cancel="stripeCardModal = false"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-dialog>

    <v-dialog
      v-model="changePlanModal"
      content-class="white"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="90%"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3" justify="end">
          <v-btn icon @click.stop="changePlanModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <subscription-plan-selection
          v-if="changePlanModal"
          no-address
          no-payment
          updating
          @click:cancel="changePlanModal = false"
          @click:submit="onSuccessChangePlan"
        />
      </v-col>
    </v-dialog>
  </v-row>
</template>

<script>
import dayjs from 'dayjs'
import { get } from 'lodash'
import { mapActions } from 'vuex'

import UpdateBillingMethod from '@/components/app/payment/UpdateBillingMethod'
import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'

export default {
  name: 'MembershipDetails',

  components: {
    UpdateBillingMethod,
    SubscriptionPlanSelection
  },

  data () {
    return {
      loading: false,
      billing: {
        membershipInterval: 0,
        nextBillingDate: null,
        planAmount: 0,
        planName: null,
        trialEndDate: null,
        subscriptionId: null,
        status: null
      },
      cardToUpate: null,
      stripeCardModal: false,
      changePlanModal: false,
      userCards: []
    }
  },

  computed: {
    hasMembership () {
      const status = this.billing.status

      return (
        !status ||
        (status !== 'incomplete' &&
          status !== 'incomplete_expired' &&
          status !== 'canceled')
      )
    },

    isTrialingStatus () {
      return this.billing.status === 'trialing'
    },

    membershipInterval () {
      switch (this.billing.membershipInterval) {
        case 'month':
          return 'monthly'

        case 'year':
          return 'yearly'
      }

      return null
    }
  },

  created () {
    this.getBillingDetails()
    this.getBillingCards()
  },

  methods: {
    ...mapActions('payment', [
      'cancelSubscription',
      'fetchBillingCards',
      'fetchBillingDetails',
      'removeBillingCard'
    ]),

    async getBillingDetails () {
      try {
        this.loading = true
        const data = await this.fetchBillingDetails()

        this.billing.subscriptionId = data.subscriptionId
        this.billing.planAmount = data.planAmount || null
        this.billing.planName = data.planName || null

        if (data.subscriptionData) {
          this.billing.membershipInterval = get(
            data,
            'subscriptionData.plan.interval',
            null
          )
          this.billing.status = get(data, 'subscriptionData.status', null)
          this.billing.trialEndDate = get(
            data,
            'subscriptionData.trial_end',
            null
          )
          this.billing.trialEndDate = this.billing.trialEndDate
            ? dayjs(this.billing.trialEndDate * 1000).format('MMMM D, YYYY')
            : null
          this.billing.nextBillingDate = dayjs(
            data.subscriptionData.current_period_end * 1000
          ).format('MMMM D, YYYY')
        }
      } finally {
        this.loading = false
      }
    },

    async getBillingCards () {
      try {
        this.loading = true
        this.userCards = await this.fetchBillingCards()
      } finally {
        this.loading = false
      }
    },

    onUpdateCard (card) {
      this.stripeCardModal = true
      this.cardToUpate = card
    },

    removeSubscription () {
      this.$nuxt.$emit('open-prompt', {
        title: 'Cancel subscription?',
        message: 'Are you sure about cancel your subscription?',
        action: async () => {
          try {
            this.loading = true
            await this.cancelSubscription()
            this.$snotify.success(
              'Subscription has been canceled successfully!'
            )
            await this.getBillingDetails()
          } catch (e) {
          } finally {
            this.loading = false
          }
        }
      })
    },

    onSuccessUpdateBilling () {
      this.stripeCardModal = false
      this.getBillingCards()
      this.getBillingDetails()
    },

    onSuccessChangePlan () {
      this.changePlanModal = false
      this.getBillingDetails()
    }
  }
}
</script>
