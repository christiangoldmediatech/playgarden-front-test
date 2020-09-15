<template>
  <v-row no-gutters>
    <v-col cols="12">
      <p class="font-weight-bold">
        MEMBERSHIP
      </p>

      <p>
        <label class="mb-1 membership-billing-date-text mt-1">
          Your next billing date is

          <b>{{ billing.nextBillingDate }}</b>
        </label>
      </p>

      <p>
        <label class="mb-1 monthly-membership-fee-text mt-1">
          Your {{ membershipInterval }} membership fee is

          <b>${{ billing.planAmount }}</b>
        </label>
      </p>

      <template>
        <v-row class="justify-space-between mt-3" no-gutters>
          <span>Plan: <b>{{ billing.planName }}</b></span>

          <v-btn
            color="primary"
            text
            class="btn-green"
            @click="changePlanModal = true"
          >
            CHANGE PLAN
          </v-btn>
        </v-row>
      </template>

      <v-row
        v-for="(card, indexUC) in userCards"
        :key="indexUC"
        class="justify-space-between my-1"
        no-gutters
      >
        <span class="font-weight-bold">
          {{ card.details.brand }} .... .... .... {{ card.details.last4 }}
        </span>

        <v-btn
          v-if="isBillingCardRemovable"
          color="accent"
          text
          @click="removeCard(card)"
        >
          REMOVE CARD
        </v-btn>
      </v-row>

      <v-row
        v-if="hasMembership"
        align="center"
        class="my-1"
        justify="space-between"
        no-gutters
      >
        <!-- Add payment method -->
        <v-btn class="ml-n5" color="primary" text @click="newCardModal = true">
          ADD NEW CARD
        </v-btn>

        <!-- Cancel suscription -->
        <v-btn color="accent" text @click="removeSubscription">
          CANCEL MEMBERSHIP
        </v-btn>
      </v-row>

      <div v-else class="my-6 text-center">
        <nuxt-link class="btn-green" :to="{ name: 'app-payment-register' }">
          CREATE MEMBERSHIP
        </nuxt-link>
      </div>

      <div v-if="isTrialingStatus" class="my-6 text--accent text-center">
        Ends: {{ billing.trialEndDate }}
      </div>
    </v-col>

    <v-dialog
      v-model="newCardModal"
      content-class="white"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="1000"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3" justify="end">
          <v-btn icon @click.stop="newCardModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <new-billing-method
          v-if="newCardModal"
          @add:success="onSuccessNewBilling"
          @click:cancel="newCardModal = false"
        />
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

import NewBillingMethod from '@/components/app/payment/NewBillingMethod'
import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'

export default {
  name: 'MembershipDetails',

  components: {
    NewBillingMethod,
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
      newCardModal: false,
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

    isBillingCardRemovable () {
      return this.userCards.length > 1
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

    removeCard (card) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Remove card?',
        message: `Are you sure you wish to remove your card that ends in '${card.details.last4}'?`,
        action: async () => {
          this.loading = true
          try {
            await this.removeBillingCard(card.id)
            await this.getBillingCards()
            this.$snotify.success('Card has been removed successfully!')
          } finally {
            this.loading = false
          }
        }
      })
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

    onSuccessNewBilling () {
      this.newCardModal = false
      this.getBillingDetails()
    },

    onSuccessChangePlan () {
      this.changePlanModal = false
      this.getBillingDetails()
    }
  }
}
</script>
