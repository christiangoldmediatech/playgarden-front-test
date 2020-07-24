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
          Your monthly membership fee is

          <b>${{ billing.monthlyMembershipFee }}</b>
        </label>
      </p>

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
          small
          text
          @click="removeCard(card)"
        >
          REMOVE CARD
        </v-btn>
      </v-row>

      <template v-if="billing.subscriptionId">
        <!-- Add payment method -->
        <v-btn
          block
          class="my-6"
          color="primary"
          x-large
          @click="newCardModal = true"
        >
          ADD NEW CARD
        </v-btn>

        <!-- Cancel suscription -->
        <v-btn block color="accent" text x-large @click="removeSubscription">
          CANCEL MEMBERSHIP
        </v-btn>
      </template>

      <div class="my-6 text-center">
        <nuxt-link :to="{ name: 'app-payment-register' }">
          CREATE MEMBERSHIP
        </nuxt-link>
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
          @add:success="onSuccess"
          @click:cancel="newCardModal = false"
        />
      </v-col>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import NewBillingMethod from '@/components/app/payment/NewBillingMethod'

export default {
  name: 'MembershipDetails',

  components: {
    NewBillingMethod
  },

  data () {
    return {
      loading: false,
      billing: {
        monthlyMembershipFee: 0,
        nextBillingDate: '',
        subscriptionId: null
      },
      newCardModal: false,
      userCards: []
    }
  },

  computed: {
    isBillingCardRemovable () {
      return this.userCards.length > 1
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

        if (data.subscriptionData) {
          // TODO: improve this after get more info about this process
          const billingItems = data.subscriptionData.items.data
          const unixTimestamp = data.subscriptionData.current_period_end
          const milliseconds = unixTimestamp * 1000
          const nextDate = new Date(milliseconds)
          const month = nextDate.toLocaleString('default', { month: 'long' })
          let cost = 0

          this.billing.nextBillingDate =
            month + ' ' + nextDate.getDate() + ', ' + nextDate.getFullYear()

          billingItems.forEach((item) => {
            cost += parseFloat(item.price.unit_amount_decimal)
          })

          this.billing.monthlyMembershipFee = cost.toFixed(2)
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

    async removeSubscription () {
      // eslint-disable-next-line no-alert
      if (confirm('Are you sure about cancel your subscription?')) {
        try {
          this.loading = true
          await this.cancelSubscription()
          this.$snotify.success('Subscription has been canceled successfully!')
        } finally {
          this.loading = false
        }
      }
    },

    onSuccess () {
      this.newCardModal = false
      this.getBillingCards()
    }
  }
}
</script>
