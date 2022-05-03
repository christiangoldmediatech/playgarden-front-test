<template>
  <pg-dialog
    v-model="isDialogVisible"
    content-class="white"
    :fullscreen="isMobile"
    max-width="700px"
    persistent
  >
    <v-col cols="12">
      <v-row class="pr-3 mb-md-n12 mt-1" justify="start">
        <v-btn
          text
          class="accent--text text-none"
          @click="handlePaymentModalBackButton"
        >
          <v-icon left>
            mdi-chevron-left
          </v-icon>
          {{ backButtonText }}
        </v-btn>
      </v-row>

      <v-card flat class="mx-4 mt-12 mb-4">
        <stripe-pay-form
          button-text="Start Learning"
          :cancelable="false"
          :is-free-for-days-text-visible="false"
          :loading="isPaymentMethodModalLoading"
          @click:submit="handlePaymentFormSubmit"
        >
          <template #header>
            <center class="pt-6">
              <underlined-title
                class="text-h6 text-md-h5"
                text="CREDIT CARD INFORMATION"
              />
            </center>
            <center class="grey--text text--darken-1 my-6 text-body-2">
              We need your credit card information to confirm who you are.
            </center>
          </template>
          <template #footer>
            <center>
              <div
                class="font-weight-bold grey--text text--darken-1 mt-6 mb-2 text-body-2"
              >
                You can cancel your trial and membership anytime from the
                account settings.
              </div>
            </center>
          </template>
        </stripe-pay-form>
      </v-card>
    </v-col>
  </pg-dialog>
</template>

<script lang="ts">
import { useAuth, useBilling, useSnotifyHelper, useVuetifyHelper } from '@/composables'
import { TypedStore } from '@/models'
import { defineComponent, computed, ref, useStore } from '@nuxtjs/composition-api'

interface StripeCardData {
  token: string
  // eslint-disable-next-line camelcase
  promotion_id?: string
}

interface StripeDataSubscription extends StripeCardData {
  sendEmail: boolean
}

export default defineComponent({
  components: {
    StripePayForm: () => import('@/components/forms/payment/StripePayForm.vue')
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },

    backButtonText: {
      type: String,
      default: 'Back to choose plan'
    }
  },

  setup(props, { emit }) {
    const vuetify = useVuetifyHelper()
    const snotify = useSnotifyHelper()
    const store = useStore<TypedStore>()
    const Auth = useAuth({ store })
    const Billing = useBilling()

    const isMobile = computed(() => vuetify.breakpoint.mobile)
    const isPaymentMethodModalLoading = ref(false)
    const isDialogVisible = computed({
      get() {
        return props.value
      },
      set (value: boolean) {
        emit('input', value)
      }
    })

    function handlePaymentModalBackButton() {
      isDialogVisible.value = false
    }

    async function handlePaymentFormSubmit(cardData: StripeCardData) {
      isPaymentMethodModalLoading.value = true

      try {
        const dataSubscrition: StripeDataSubscription = {
          token: cardData.token,
          sendEmail: true
        }

        if (cardData.promotion_id) {
          dataSubscrition.promotion_id = cardData.promotion_id
        }

        await Billing.addBillingCard(dataSubscrition)

        // cleanup
        await Auth.fetchUserInfo()

        snotify.success('Payment method added!')
        emit('card-added')
      } catch (e) {
        snotify.error('Could not add payment method! Please try again.')
      } finally {
        isPaymentMethodModalLoading.value = false
      }
    }

    return {
      isMobile,
      isDialogVisible,
      isPaymentMethodModalLoading,
      handlePaymentModalBackButton,
      handlePaymentFormSubmit
    }
  }
})
</script>