<template>
  <div
    :class="[
      'pg-px-4',
      'lg:pg-pb-32',
    ]"
  >
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-mx-auto',
        'pg-max-w-[768px]',
        'lg:pg-max-w-[1300px]',
      ]"
    >
      <div class="pg-my-6">
        <BackButton v-if="!isSignupProcess" @click="handleGoBack" />
      </div>

      <!-- CONTENT -->
      <div
        :class="[
          'pg-grid',
          'pg-grid-cols-1',
          'sm:pg-mt-12',
          'lg:pg-grid-cols-12',
          'lg:pg-gap-24',
        ]"
      >
        <!-- LEFT -->
        <div class="pg-col-span-full lg:pg-col-span-7">
          <StripePayForm
            :loading="loading"
            :button-text="stripeButtonText"
            :is-free-for-days-text-visible="!isUserInactive"
            :is-trial-text-visible="!isUserInactive"
            :is-not-charged-text-visbile="!isUserInactive"
            @click:submit="handleSubmit"
          />
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
            'lg:pg-col-span-5',
            'lg:pg-mt-0',
          ]"
        >
          <CardPlaygarden
            :value="showCardPlaygarden"
            :is-user-inactive="isUserInactive"
            @input="showCardPlaygarden = !showCardPlaygarden"
          />
          <div class="pg-py-2" />
          <CardKnowMore
            v-if="!isUserInactive"
            :value="!showCardPlaygarden"
            @input="showCardPlaygarden = !showCardPlaygarden"
          />
        </div>
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
  useStore,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'
import { useGtm } from '@/composables/web/gtm'
import { useUTM } from '@/composables/web/utm'
import { usePayment, useSnotifyHelper } from '@/composables'
import { useUser } from '@/composables/users'
import StripePayForm from '@/components/forms/payment/StripePayForm.vue'
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import { CardData, DataSubscription } from '@/models'
import CardPlaygarden from '@/components/app/register/CardPlaygarden.vue'
import CardKnowMore from '@/components/app/register/CardKnowMore.vue'

export default defineComponent({
  name: 'Payment',

  components: {
    StripePayForm,
    CardPlaygarden,
    CardKnowMore,
    BackButton
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const snotify = useSnotifyHelper()

    const Gtm = useGtm()
    const Utm = useUTM({ route: route.value })
    const User = useUser()
    const Payment = usePayment()

    const loading = ref(false)
    const showCardPlaygarden = ref(true)

    const mode = computed(() => route.value.params.mode ?? '')
    const isUserInactive = computed(() => mode.value === 'activate-user')
    const isSignupProcess = computed(() => route.value.query.process === 'signup')

    const stripeButtonText = computed(() => {
      return isUserInactive.value
        ? 'REACTIVATE ACCOUNT'
        : 'START YOUR FREE TRIAL'
    })

    function handleGoBack() {
      if (isUserInactive.value) {
        router.push({ name: 'app-inactive-subscription' })
        return
      }

      router.push({
        name: 'app-payment-plan',
        query: {
          process: 'signup',
          step: '2'
        }
      })
    }

    async function goToNextStep() {
      if (isUserInactive.value) {
        await User.getUserInfo()
        handleGoBack()
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
        snotify.error('Something went wrong. Please try again.')
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
      loading,
      showCardPlaygarden,
      isUserInactive,
      stripeButtonText,
      isSignupProcess,
      handleGoBack,
      handleSubmit
    }
  }
})
</script>
