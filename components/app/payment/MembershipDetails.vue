<template>
  <v-row no-gutters>
    <v-col cols="12">
      <p class="font-weight-bold">
        MEMBERSHIP
      </p>

      <v-row
        v-if="billing.status === 'trialing'"
        no-gutters
        class="mb-3"
      >
        <v-col cols="12" md="7" lg="7">
          <span>
            Free trial period ends
          </span>
        </v-col>

        <v-col cols="12" md="5" lg="5" class="pr-3 text-left">
          <b>{{ billing.trialEndDate }}</b>
        </v-col>
      </v-row>
      <v-row
        v-else
        no-gutters
        class="mb-3"
      >
        <v-col cols="12" md="7" lg="7">
          <span>
            Your next billing date is
          </span>
        </v-col>

        <v-col cols="12" md="5" lg="5" class="pr-3 text-left">
          <div>
            <span>
              <b>{{ billing.nextBillingDate }}</b>
            </span>
          </div>
        </v-col>
      </v-row>

      <v-row
        no-gutters
        class="mb-3"
      >
        <v-col cols="12" md="7">
          <span>
            Your {{ membershipInterval }} membership fee is
          </span>
        </v-col>

        <v-col cols="12" md="5" class="pr-3 text-left">
          <div>
            <span>
              <b>{{ billing.planAmount.toLocaleString("en-US", { style: 'currency', currency: 'USD' }) }}</b>
            </span>
          </div>
        </v-col>
      </v-row>
      <v-row
        v-if="billing.planAmountDiscount"
        no-gutters
      >
        <v-col cols="12" md="7" :class="(!$vuetify.breakpoint.mobile) ? 'text-right discount-label' : ''">
          <span>
            Discount
          </span>
        </v-col>

        <v-col cols="12" md="5" class="pr-3 text-left">
          <div>
            <span v-if="billing.percentOff">
              <b>- {{ billing.percentOff }} %</b>
            </span>
            <span v-if="billing.amountOff">
              <b>{{ billing.amountOff.toLocaleString("en-US", { style: 'currency', currency: 'USD' }) }}</b>
            </span>
          </div>
        </v-col>
      </v-row>

      <v-divider v-if="billing.planAmountDiscount" />

      <v-row
        v-if="billing.planAmountDiscount"
        no-gutters
        class="mt-2"
      >
        <v-col cols="7">
          <span />
        </v-col>

        <v-col cols="5" class="pr-3 text-left">
          <div>
            <span>
              <b v-if="billing.planAmountDiscount">{{ billing.planAmountDiscount.toLocaleString("en-US", { style: 'currency', currency: 'USD' }) }}</b>
            </span>
          </div>
        </v-col>
      </v-row>

      <template>
        <v-row align="center" class="mb-2" no-gutters>
          <v-col cols="12" md="7">
            Plan:
          </v-col>
          <v-col cols="12" md="5">
            <b>{{ billing.planName }}</b>
          </v-col>
        </v-row>
        <v-row align="center" class="mb-2" no-gutters>
          <v-col cols="12" md="7" />
          <v-col cols="12" md="5">
            <v-btn
              color="primary"
              class="pa-md-4 ml-n4 md-n0"
              text
              @click="changePlanModal = true"
            >
              CHANGE PLAN
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <v-row
        v-for="(card, indexUC) in userCards"
        :key="indexUC"
        align="center"
        class="mb-2"
        no-gutters
      >
        <v-col class="text-truncate" cols="12" md="7">
          Card:
        </v-col>
        <v-col cols="12" md="5">
          <span class="font-weight-bold">
            {{ card.details.brand }} <br>.... .... .... {{ card.details.last4 }}
          </span>
        </v-col>
      </v-row>
      <v-row align="center" class="mb-2" no-gutters>
        <v-col cols="12" md="7" />
        <v-col cols="12" md="5">
          <v-btn
            color="primary"
            justify-md="end"
            class="pa-md-4 ml-n4 md-n0"
            text
            @click="onUpdateCard(card)"
          >
            UPDATE PAYMENT
          </v-btn>
        </v-col>
      </v-row>

      <v-row
        v-if="hasMembership"
        align="center"
        class="my-1"
        justify="center"
        justify-md="center"
        no-gutters
      >
        <!-- Cancel suscription -->
        <v-btn color="accent" text @click="removeSubscriptionModal = true">
          CANCEL MEMBERSHIP
        </v-btn>
      </v-row>

      <div v-else class="my-6 text-center">
        <nuxt-link :to="{ name: 'app-payment-register' }">
          CREATE MEMBERSHIP
        </nuxt-link>
      </div>
    </v-col>

    <!-- Cancel suscription modal -->
    <v-dialog
      v-model="removeSubscriptionModal"
      content-class="white"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="1000"
    >
      <v-col cols="12">
        <v-row justify="end">
          <v-btn icon @click.stop="removeSubscriptionModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row class="flex-column-reverse flex-md-row">
          <v-col class="px-6" cols="12" md="6">
            <v-col class="text-center" cols="12">
              <span
                class="font-weight-bold pg-letter-spacing text-h5 text-md-h4"
              >
                WE ARE SORRY
                <br>
                TO SEE YOU GO!
              </span>
            </v-col>

            <v-card-text class="text-justify">
              Early child development is super important, and consistency is key
              to ensure early learning!<br>
              <br>
              Are you sure you want to cancel your membership?
            </v-card-text>
          </v-col>

          <v-col class="px-6" cols="12" md="6">
            <div>
              <v-img
                alt="Remove Subscription"
                max-width="100%"
                :src="require('assets/png/remove-subscription.png')"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="text-center" cols="12">
        <v-btn
          color="primary"
          :loading="loading"
          x-large
          @click="removeSubscription"
        >
          CONFIRM CANCELATION
        </v-btn>
      </v-col>

      <v-col class="text-center" cols="12">
        <v-btn
          color="accent"
          :loading="loading"
          x-large
          text
          @click.stop="removeSubscriptionModal = false"
        >
          GO BACK
        </v-btn>
      </v-col>
    </v-dialog>

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
        planAmountDiscount: null,
        percentOff: null,
        amountOff: null,
        planName: null,
        trialEndDate: null,
        subscriptionId: null,
        status: null
      },
      cardToUpate: null,
      stripeCardModal: false,
      changePlanModal: false,
      removeSubscriptionModal: false,
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
    this.$nuxt.$on('children-changed', this.getBillingDetails)
  },
  mounted () {
    const val = this.$route.params.changeplan
    if (val && Boolean(val)) {
      this.changePlanModal = true
    }
  },
  beforeDestroy () {
    this.$nuxt.$off('children-changed')
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
        this.billing.planAmountDiscount = data.planAmountDiscount || null
        this.billing.amountOff = data.amountOff || null
        this.billing.percentOff = data.percentOff || null

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
    async removeSubscription () {
      try {
        this.loading = true
        await this.cancelSubscription()
        this.$snotify.success('Subscription has been canceled successfully!')
        await this.getBillingDetails()
        this.removeSubscriptionModal = false
      } catch (e) {
      } finally {
        this.loading = false
      }
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

<style lang="scss" scoped>
.discount-label{
  padding-right: 17%;
}
</style>
