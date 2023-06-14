<template>
  <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': membershipColor }">
    <div class="w-100 d-flex justify-space-between align-centers">
      <span class="account-card-title">
        {{ $t('account.membership.title') }}
      </span>
    </div>

    <div class="py-2 account-card-subtitle">
      {{ $t('account.membership.subtitle') }}
    </div>

    <div class="account-pink-dashed-line my-4 mx-auto"></div>

    <v-col v-if="billing" cols="12">
      <v-row no-gutters>
        <v-col cols="12" class="mb-4">
          <span class="account-field-label">  {{ $t('account.membership.nextBilling') }}</span>
          <p class="account-field-value ma-0">
            {{ billing.nextBillingDate }}
          </p>
        </v-col>

        <v-col cols="12" class="mb-4">
          <span class="account-field-label">
            {{ $t('account.membership.feeDescription', {type: membershipInterval}) }}
          </span>
          <div
            v-if="billing.planAmountDiscount"
            cols="12"
            class="account-field-value"
          >
            <div>
              <span>{{
                billing.planAmountDiscount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })
              }}</span>
              <span class="strikethrough old_price grey--text">
                {{
                  billing.planAmount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })
                }}
              </span>
            </div>
          </div>
          <div
            v-else-if="billing.percentOff"
            cols="12"
            class="account-field-value"
          >
            <div>
              <span>{{
                getTotalPay.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })
              }}</span>
              <span class="strikethrough old_price grey--text">
                {{
                  billing.planAmount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })
                }}
              </span>
            </div>
          </div>
          <div
            v-else
            cols="12"
            class="account-field-value"
          >
            <div>
              <span>
                {{
                  billing.planAmount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })
                }}
              </span>
            </div>
          </div>
        </v-col>

        <v-col v-if="billing.planAmountDiscount || billing.percentOff" cols="12" class="mb-4">
          <span class="account-field-label">
            Coupon applied
          </span>
          <v-icon color="#68C453">
            mdi-check-circle
          </v-icon>
        </v-col>

        <v-col v-if="plan" cols="12" class="mb-4">
          <span class="account-field-label">{{ $t('account.membership.plan') }}</span>
          <p class="account-field-value ma-0">
            {{ plan.name }}
          </p>
        </v-col>

        <v-col v-if="billings.length > 0" class="mb-4">
          <span class="account-field-label">{{ $t('account.membership.billing') }}</span>
          <v-btn class="text-decoration-underline text-transform-none" color="#FFAB37" text x-small @click="viewBillingHistory = true">
            {{ $t('commonWords.viewMore') }}
          </v-btn>
          <v-row no-gutters class="mb-2">
            <v-col cols="6">
              <span class="account-small-header">{{ $t('commonWords.date') }}</span>
            </v-col>
            <v-col cols="6">
              <span class="account-small-header">{{ $t('commonWords.price') }}</span>
            </v-col>
          </v-row>
          <div v-for="billing in billings" :key="`billing-${billing.id}`">
            <v-row class="mb-2" align="center" no-gutters>
              <v-col cols="6">
                <span class="account-small-value">{{ billing.dateFormatted }}</span>
              </v-col>
              <v-col cols="6" class="d-flex">
                <span class="account-small-value">${{ billing.totalFormatted }} {{ billing.currency.toUpperCase() }} /{{ billing.period }} plan<br></span>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col v-if="userCards.length > 0" cols="12" class="mb-4">
          <span class="account-field-label">{{ $t('account.membership.payment') }}</span>
          <p class="account-field-value ma-0">
            {{ cardMaskedNumber }}
          </p>
        </v-col>
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
        {{ $t('commonWords.viewMore') }}
      </v-btn>
    </v-col>

    <billing-history-dialog v-model="viewBillingHistory" />
  </v-card>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { get } from 'lodash'
import { TypedStore } from '@/models'
import { computed, defineComponent, onMounted, ref, useRouter, useStore } from '@nuxtjs/composition-api'
import { useBilling, useLanguageHelper } from '@/composables'
import BillingHistoryDialog from '@/components/BillingHistoryDialog.vue'

export default defineComponent({
  components: { BillingHistoryDialog },
  name: 'MembershipCard',
  setup() {
    const language = useLanguageHelper()

    const membershipColor = ref('255, 160, 200')

    const viewBillingHistory = ref(false)
    const loading = ref(false)
    const billing = ref<any>(null)
    const plan = ref<any>(null)
    const userCards = computed(() => store.getters['payment/getCards'])

    const { billings, getBillingHistory } = useBilling()

    const store = useStore<TypedStore>()
    const router = useRouter()

    const membershipInterval = computed(() => {
      switch (billing.value?.membershipInterval) {
        case 'month':
          return language.t('account.membership.monthly')
        case 'year':
          return language.t('account.membership.yearly')
      }
      return null
    })

    const cardMaskedNumber = computed(() => {
      const card = userCards.value[0]

      if (card) {
        return `${card.details.brand} •••• •••• •••• ${card.details.last4}`
      }

      return ''
    })

    const getTotalPay = computed(() => {
      if (!billing.value) { return 0 }

      return (
        (billing.value.percentOff * billing.value.planAmount) / 100 -
        billing.value.planAmount
      ).toFixed(2)
    })

    const getBillingDetails = async () => {
      let storedBilling = store.getters['payment/getBilling']

      if (!storedBilling) {
        storedBilling = await store.dispatch('payment/fetchBillingDetails')
      }
      const data = { ...storedBilling }
      billing.value = {}
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
    }

    const getPlan = async () => {
      try {
        store.dispatch('disableAxiosGlobal')
        let userPlan = store.getters['payment/getUserPlan']
        if (!userPlan) {
          userPlan = await store.dispatch('payment/getSelectedSubscriptionPlan')
        }

        const response = userPlan
        plan.value = response.plan
      } catch (e) {
      } finally {
        store.dispatch('enableAxiosGlobal')
      }
    }

    const getBillingCards = async () => {
      if (userCards.value.length === 0) {
        await store.dispatch('payment/fetchBillingCards')
      }
    }

    const goToPage = () => {
      router.push({ name: 'app-account-index-membership' })
    }

    const init = async () => {
      loading.value = true
      store.commit('account/SET_LOADING_MEMBERSHIP_INFO', loading.value)
      try {
        await getBillingDetails()
        await getBillingCards()
        await getPlan()
        await getBillingHistory()
      } catch (e) {
      } finally {
        loading.value = false
        store.commit('account/SET_LOADING_MEMBERSHIP_INFO', loading.value)
      }
    }

    onMounted(async () => {
      await init()
    })

    return {
      viewBillingHistory,
      membershipColor,
      billing,
      billings,
      getTotalPay,
      userCards,
      cardMaskedNumber,
      plan,
      membershipInterval,
      goToPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';

.strikethrough {
  position: relative;
}

.strikethrough:before {
  position: absolute;
  color: var(--v-accent-base) !important;
  content: '';
  left: 0;
  top: 50%;
  right: 0;
  border-top: 1px solid;
  border-color: inherit;

  -webkit-transform: rotate(-10deg);
  -moz-transform: rotate(-10deg);
  -ms-transform: rotate(-10deg);
  -o-transform: rotate(-10deg);
  transform: rotate(-10deg);
}

.strikethrough:after {
  position: absolute;
  color: var(--v-accent-base) !important;
  content: '';
  left: 0;
  top: 50%;
  right: 0;
  border-top: 1px solid;
  border-color: inherit;

  -webkit-transform: rotate(10deg);
  -moz-transform: rotate(10deg);
  -ms-transform: rotate(10deg);
  -o-transform: rotate(10deg);
  transform: rotate(10deg);
}
</style>
