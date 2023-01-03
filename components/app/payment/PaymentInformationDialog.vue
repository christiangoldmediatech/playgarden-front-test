<template>
  <v-dialog v-model="dialog" class="payment-info-dialog" persistent max-width="700px">
    <v-card class="card-wrapper py-10">
      <v-btn class="btn-close" icon color="white" large @click="dialog = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="d-flex justify-center mb-6">
        <h1 class="text-center dialog-title">
          Please confirm your payment information
        </h1>
      </v-card-title>

      <v-card-text class="d-flex flex-column align-center px-12">
        <div>
          <p>
            <span class="option-text">Current Plan: </span>
            <span class="option-value">{{ currentPlanName }}</span>
          </p>
        </div>

        <div class="pg-relative w-100 d-flex justify-center">
          <p>
            <span class="option-text">Switch to: </span>
            <span class="option-value">{{ planToSwitchTo }}</span>
          </p>

          <v-btn
            text
            color="#F89838"
            class="right-positioned-btn"
            @click="dialog = false"
          >
            <span class="text-decoration-underline">Edit</span>
            <v-icon right>
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>

        <payment-information class="py-3" :user-cards="userCards" @update:cards="getCards" />

        <div class="w-100">
          <h2 class="payment-title mb-3">
            Do you have a coupon?
          </h2>
          <div class="d-flex justify-space-between">
            <validation-provider v-slot="{ errors }" class="w-100" name="Promotion Code" rules="min:5">
              <pg-text-field
                v-model="promotionCode"
                :error-messages="errors"
                label="Promotion Code"
                :color="isValidCoupon ? '' : 'error'"
                :suffix="getTextValidateCoupon"
                :loading="isValidatingCoupon"
                solo
              />
            </validation-provider>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="d-flex flex-column align-center">
        <v-btn
          class="white--text px-16 mb-2 custom-btn-shadow"
          x-large
          elevation="0"
          color="#AAD579"
          :loading="loading"
          :disabled="lockButton || disableBtn"
          @click="onSubmit"
        >
          {{ btnConfirmationText }}
        </v-btn>
        <v-btn text color="#F89838" class="px-16" x-large @click="dialog = false">
          <span class="text-decoration-underline">Cancel</span>
        </v-btn>
      </v-card-actions>

      <div class="img-wrapper">
        <img
          src="@/assets/svg/gift-of-learning/bottom-color-dashes.svg"
          class="pg-absolute pg-bottom-0 pg-left-0 pg-right-0 pg-mx-auto pg-w-full lg:pg-w-auto"
        >
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useAuth, useBilling, useSnotifyHelper, useNotification, useNuxtHelper } from '@/composables'
import { TypedStore } from '@/models'
import { defineComponent, computed, useStore, ref, onMounted, watch } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'
import PaymentInformation from './PaymentInformation.vue'

export default defineComponent({
  name: 'PaymentInformationDialog',
  components: {
    PaymentInformation
  },
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    plan: {
      type: Object,
      default: null
    },
    billAnnually: {
      type: Boolean,
      default: false,
      required: true
    },
    fromPlaydates: {
      type: Boolean,
      default: false,
      required: true
    },
    draft: {
      type: Object,
      default: null
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const dialog = computed({
      get () { return props.value },
      set (value: boolean) { emit('input', value) }
    })

    const store = useStore<TypedStore>()
    const Auth = useAuth({ store })
    const { setIsTrialEndingPlanSelectedModalVisible } = useNotification({
      store
    })
    const Billing = useBilling()
    const snotify = useSnotifyHelper()
    const nuxt = useNuxtHelper()
    const loading = ref(false)
    const currentPlanName = computed(() => store.getters['auth/getUserInfo'].planSelected.planName)
    const planToSwitchTo = computed(() => props.plan?.name)
    const promotionCode = ref<string | null>(null)
    const promotionId = ref<string | null>(null)
    const userCards = ref([])
    const isValidCoupon = ref(false)
    const isValidatingCoupon = ref(false)
    const lockButton = ref(false)
    const disableBtn = computed(() => userCards.value?.length === 0)
    const btnConfirmationText = computed(() => `Upgrade to ${planToSwitchTo.value}`)
    const getTextValidateCoupon = computed(() => {
      if (promotionCode.value) {
        return (isValidCoupon.value) ? 'VALID COUPON' : 'INVALID COUPON'
      } else {
        return ''
      }
    })

    const onSubmit = async () => {
      loading.value = true
      const plan = { ...props.draft }
      plan.id = props.plan.id
      plan.type = props.billAnnually ? 'annual' : 'monthly'
      plan.fromPlaydates = props.fromPlaydates
      try {
        if (userCards.value?.length === 0) {
          snotify.error('A credit card must be provided')
          loading.value = false
          return
        }

        await store.dispatch('payment/selectSubscriptionPlan', plan)

        if (promotionId.value) {
          await store.dispatch('coupons/updateSubcriptionCoupon', { promotion_id: promotionId.value })
        }

        await Auth.fetchUserInfo()
        setIsTrialEndingPlanSelectedModalVisible(true)
        nuxt.$emit('plan-membership-changed')
      } catch (e) {
        snotify.error('Could not select plan. Please, try again later.')
      } finally {
        dialog.value = false
        promotionId.value = null
        loading.value = false
      }
    }

    const checkValid = debounce(async () => {
      try {
        isValidatingCoupon.value = true
        if (promotionCode.value) {
          lockButton.value = true
          const coupons = await store.dispatch('coupons/getCoupons', { active: true, code: promotionCode.value })
          if (coupons.length > 0) {
            promotionId.value = coupons[0].promotion_id
            isValidCoupon.value = true
            lockButton.value = false
          } else {
            isValidCoupon.value = false
            lockButton.value = true
            promotionId.value = null
          }
        }
      } catch (error) {
        isValidCoupon.value = false
        lockButton.value = true
      } finally {
        isValidatingCoupon.value = false
      }
    }, 1050)

    const getCards = async () => {
      userCards.value = await Billing.fetchBillingCards()
    }

    watch(promotionCode, (val) => {
      if (val) {
        lockButton.value = true
        promotionCode.value = (val as string).toUpperCase()
        if (val.length >= 5) {
          checkValid()
        }
      } else {
        lockButton.value = false
        promotionId.value = null
      }
    })

    onMounted(async () => {
      await getCards()
    })

    return {
      dialog,
      userCards,
      currentPlanName,
      planToSwitchTo,
      btnConfirmationText,
      onSubmit,
      loading,
      getCards,
      promotionCode,
      isValidCoupon,
      getTextValidateCoupon,
      isValidatingCoupon,
      lockButton,
      disableBtn
    }
  }
})

</script>

<style lang="scss" scoped>
.payment-info-dialog {
  z-index: 1000;
}

.card-wrapper {
  position: relative;
  border-radius: 45px;
}

.btn-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #F6B7D2;
}

.dialog-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 151.8%;
  color: #C399ED;
  word-break: break-word;
}

.option-text, .option-value {
  font-family: 'Quicksand';
  font-style: normal;
  font-size: 20px;
  line-height: 151.8%;
  color: #707070;
}

.option-text {
  font-weight: 500;
}

.option-value {
  font-weight: 700;
}

.right-positioned-btn {
  position: absolute !important;
  right: 0;
  top: 0;
}

.custom-btn-shadow {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.160784) !important;
}

.img-wrapper {
  width: 100%;
  position: absolute;
  bottom: 0;

  img {
    width: 100%;
  }
}
</style>
