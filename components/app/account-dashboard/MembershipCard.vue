<template>
  <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': membershipColor }">
    <div class="w-100 d-flex justify-space-between align-centers">
      <span class="account-card-title">
        Membership
      </span>
    </div>

    <div class="py-2 account-card-subtitle">
      Information about your membership
    </div>

    <div class="account-pink-dashed-line my-4 mx-auto"></div>

    <v-col cols="12">
      <v-row no-gutters>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-btn
        class="white--text rounded-0"
        color="#FFA0C8"
        elevation="0"
        block
        @click="goToPage"
      >
        VIEW MORE
      </v-btn>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { get } from 'lodash'
import { TypedStore } from '@/models'
import { defineComponent, onMounted, ref, useRouter, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'MembershipCard',
  setup() {
    const membershipColor = ref('255, 160, 200')

    const loading = ref(false)
    const billing = ref<any>()
    const userCards = ref<any>([])

    const store = useStore<TypedStore>()
    const router = useRouter()

    const getBillingDetails = async () => {
      try {
        loading.value = true
        const data = await store.dispatch('payment/fetchBillingDetails')
        billing.value.billingType = data.billingType
        billing.value.subscriptionId = data.subscriptionId
        billing.value.planAmount = data.planAmount || null
        billing.value.planName = data.planName || null
        billing.value.planAmountDiscount = data.planAmountDiscount || null
        billing.value.amountOff = data.amountOff || null
        billing.value.percentOff = data.percentOff || null
        billing.value.stripeStatus = data.stripeStatus || ''

        if (data.subscriptionData) {
          billing.value.membershipInterval = get(
            data,
            'subscriptionData.plan.interval',
            null
          )
          billing.value.status = get(data, 'subscriptionData.status', null)
          billing.value.trialEndDate = get(
            data,
            'subscriptionData.trial_end',
            null
          )
          billing.value.trialEndDate = billing.value.trialEndDate
            ? dayjs(billing.value.trialEndDate * 1000).format('MMMM D, YYYY')
            : null
          billing.value.nextBillingDate = dayjs(
            data.subscriptionData.current_period_end * 1000
          ).format('MMMM D, YYYY')
          billing.value.discountCode = get(
            data,
            'subscriptionData.discount.coupon.name',
            null
          )
        }
      } finally {
        loading.value = false
      }
    }

    const getBillingCards = async () => {
      try {
        loading.value = true
        userCards.value = await store.dispatch('payment/fetchBillingCards')
      } finally {
        loading.value = false
      }
    }

    const goToPage = () => {
      router.push({ name: 'app-account-index-membership' })
    }

    onMounted(async () => {
      await getBillingDetails()
      await getBillingCards()
    })

    return {
      membershipColor,
      goToPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';
</style>
