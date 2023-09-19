<template>
  <div
    :class="[
      'pg-flex',
      'pg-flex-col',
      'pl-2',
      'pg-mx-auto',
    ]"
  >
    <PromoCodeDialog
      v-model="showPromoCodeDialog"
      @reject="handlePromoCodeRejection"
    />

    <SkipPaymentModal v-model="viewModal" @click:skip="$emit('click:skip')" />

    <!-- CONTENT -->
    <div
      :class="[
        'pg-grid',
        'pg-grid-cols-1',
        'lg:pg-grid-cols-12',
        'lg:pg-gap-24'
      ]"
    >
      <!-- LEFT -->
      <div class="pg-col-span-full lg:pg-col-span-6">
        <StripePayForm
          :loading="loading"
          button-text="ENROLL MY CHILD"
          :is-free-for-days-text-visible="!isUserInactive"
          :is-trial-text-visible="false"
          :is-not-charged-text-visbile="!isUserInactive"
          is-preschool-flow
          @click:submit="handleSubmit"
        >
          <template #header>
            <p
              class="text-left pg-capitalize pg-leading-[27px] !pg-text-[12px]"
            >
              <span class="pg-font-[600]">
                Playgarden Online Features Live Zoom Classes With Teachers And Other Students. <span class="pg-text-[#F89838]">For The Safety Of Our Students</span>, We Need Your Credit Card Information <span class="pg-text-[#F89838]">For Verification Purposes</span>. You Will NOT Be Charged Until The End Of Your 15 Day Free Trial. Cancel Anytime Before Your Trial Ends, And Your Payment Method Will Be Deleted.
              </span>
            </p>
            <p
              class="text-center text-md-left"
            >
              <underlined-title
                class="text-h6 text-md-h5"
                text="CREDIT CARD INFORMATION"
              />
              <br />
            </p>
          </template>
          <template #sub-footer>
            <p>
              <center>
                <span class="font-weight-bold text-completely !pg-leading-5">
                  Playgarden Prep Online is COMPLETELY FREE for the next 15 days.
                  <br />
                  YOU CAN CANCEL YOUR TRIAL ANY TIME
                </span>
              </center>
            </p>
            <v-btn
              block
              min-height="60"
              class="mb-6 !pg-underline"
              color="#FFAB37"
              :loading="loading"
              text
              x-large
              @click="viewModal = true"
            >
              SKIP FOR TODAY
            </v-btn>
          </template>
        </StripePayForm>
      </div>

      <!-- RIGHT -->
      <div
        :class="[
          'pg-col-span-full',
          'pg-flex',
          'pg-flex-col',
          'pg-justify-center',
          'pg-mt-14',
          'pg-mx-auto',
          'lg:pg-col-span-6',
          'lg:pg-mt-0'
        ]"
      >
        <CardPlaygarden
          :value="showCardPlaygarden"
          :is-user-inactive="isUserInactive"
          @input="showCardPlaygarden = !showCardPlaygarden"
        >
          <template #title>
            <div class="pg-text-center mt-5">
              <NormalTitle
                font-size="24px"
                font-size-mobile="20px"
                text="Join thousands of happy families that have graduated from Playgarden Prep"
              />
            </div>
          </template>
        </CardPlaygarden>
        <div class="pg-py-2" />
        <CardKnowMore
          v-if="!isUserInactive"
          :value="!showCardPlaygarden"
          @input="showCardPlaygarden = !showCardPlaygarden"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRoute,
  useRouter,
  useStore
} from '@nuxtjs/composition-api'
import { useGtm } from '@/composables/web/gtm'
import { useUTM } from '@/composables/web/utm'
import {
  usePayment,
  useToastHelper
} from '@/composables'
import { useUser } from '@/composables/users'
import StripePayForm from '@/components/forms/payment/StripePayForm.vue'
import { CardData, DataSubscription } from '@/models'
import CardPlaygarden from '@/components/app/register/CardPlaygarden.vue'
import CardKnowMore from '@/components/app/register/CardKnowMore.vue'
import PromoCodeDialog from '@/components/app/register/PromoCodeDialog.vue'
import { usePromoCodeDialog } from '@/composables/web/signup'
import SkipPaymentModal from './SkipPaymentModal.vue'

export default defineComponent({
  name: 'PaymentStep',

  components: {
    StripePayForm,
    CardPlaygarden,
    SkipPaymentModal,
    CardKnowMore,
    PromoCodeDialog
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const toast = useToastHelper()

    const viewModal = ref(false)

    const Gtm = useGtm()
    const Utm = useUTM({ route: route.value })
    const User = useUser()
    const Payment = usePayment()

    const isUserInactive = computed(() => mode.value === 'activate-user')
    const PromoCodeDialog = usePromoCodeDialog({ isUserInactive, router })

    const loading = ref(false)
    const showCardPlaygarden = ref(true)

    const mode = computed(() => route.value.params.mode ?? '')
    const isSignupProcess = computed(
      () => route.value.query.process === 'signup'
    )

    async function goToNextStep() {
      if (isUserInactive.value) {
        await User.getUserInfo()
        PromoCodeDialog.goBack()
        return
      }

      router.push({
        name: 'app-children',
        query: {
          step: '4',
          process: 'signup',
          ...Utm.utmContent.value
        }
      })
    }

    async function handleSubmit(data: CardData) {
      try {
        loading.value = true

        const dataSubscription: DataSubscription = {
          token: data.token
        }

        if (data.promotion_id) {
          dataSubscription.promotion_id = data.promotion_id
        }

        await Payment.payShorterSubscription(dataSubscription)

        if (isSignupProcess.value) {
          await store.dispatch('auth/fetchUserInfo', undefined, { root: true })
        }

        goToNextStep()
      } catch {
        toast.error('Something went wrong. Please try again.')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (isUserInactive.value) {
        Gtm.paymentPage({
          conversionID: '959213252',
          conversionLabel: 'SvccCMTX0voBEMTdsckD'
        })
      }
    })

    return {
      viewModal,
      loading,
      showCardPlaygarden,
      isUserInactive,
      isSignupProcess,
      showPromoCodeDialog: PromoCodeDialog.showPromoCodeDialog,
      handlePromoCodeRejection: PromoCodeDialog.handlePromoCodeRejection,
      handleBackButtonClick: PromoCodeDialog.handleBackButtonClick,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.info-pay {
  font-size: 15px;
  font-weight: 500;
  color: rgba(96, 96, 96, 0.8) !important;
  text-align: center;
  font-weight: bold;
}
.text-completely {
  font-size: 16px !important;
  color: rgba(96, 96, 96, 0.8) !important;
}
.option-standar {
  color: var(--v-accent-base) !important;
}
</style>
