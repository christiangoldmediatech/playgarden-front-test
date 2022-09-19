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
        <BackButton v-if="isSignupProcess" @click="$emit('click:back')" />
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
            is-preschool-flow
            @click:submit="handleSubmit"
          >
            <template #header>
              <p
                class="text-center text-md-left"
                :class="{ 'mt-n10': $vuetify.breakpoint.smAndUp }"
              >
                <underlined-title
                  class="text-h6 text-md-h5"
                  text="CREDIT CARD INFORMATION"
                />
                <br>
              </p>
              <p class="text-left pg-capitalize pg-leading-[27px] !pg-text-[14px]">
                Playgarden Online features live Zoom classes with teachers and other students.
                <strong class="pg-text-accent">
                  For the safety of our students,
                </strong>
                we need your credit card information
                <strong class="pg-text-accent">
                  for verification purposes.
                </strong>
                <strong class="pg-font-semibold">
                  You will NOT be charged until the end of your 15 day free trial. Cancel anytime before your trial ends, and your payment method will be deleted.
                </strong>
              </p>
            </template>
            <template #sub-footer>
              <p>
                <center>
                  <span class="font-weight-bold text-completely">
                    Playgarden Prep Online is COMPLETELY FREE for the next 15 days.
                  </span>
                </center>
              </p>
            </template>
            <template #footer>
              <p>
                <center class="ml-2">
                  <span class="info-pay">
                    <span
                      class="d-none d-md-block"
                    >You can cancel your trial and membership anytime from the
                      account settings. <br></span>
                    Once your free trial ends you will be placed on the
                    <span class="option-standar">ONLINE PRESCHOOL</span> monthly plan, you can
                    change plans at any time in your profile page.
                  </span>
                </center>
              </p>
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
            'lg:pg-col-span-5',
            'lg:pg-mt-0',
          ]"
        >
          <CardPlaygarden
            :value="showCardPlaygarden"
            :is-user-inactive="isUserInactive"
            @input="showCardPlaygarden = !showCardPlaygarden"
          >
            <template #title>
              <div class="pg-text-center mt-5">
                <UnderlinedTitle
                  font-size="26px"
                  font-size-mobile="20px"
                  text="Thousands of families love Playgarden! Here's why:"
                />
              </div>
            </template>
            <template #testimonials>
              <div class="mt-5 pg-text-left pg-m-0 pg-font-normal">
                <p class="pg-flex pg-items-center pg-justify-start pg-text-[14px]">
                  <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.794 17.534C20.4691 22.8299 16.5725 23.7927 11.2742 21.4668C5.9759 19.1408 -1.54067 8.77271 0.784217 3.47676C3.10911 -1.81918 14.9756 0.916572 20.2739 3.24249C25.5721 5.56841 25.1189 12.238 22.794 17.534Z" fill="#FAA938" />
                  </svg>
                  <span class="ml-2">
                    "My children ask to watch videos of their favorite teacher."
                  </span>
                </p>
                <p class="pg-flex pg-items-center pg-justify-start pg-text-[14px]">
                  <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.794 17.4983C20.4691 22.7943 16.5725 23.757 11.2742 21.4311C5.9759 19.1052 -1.54067 8.73706 0.784217 3.44112C3.10911 -1.85482 14.9756 0.880928 20.2739 3.20685C25.5721 5.53277 25.1189 12.2024 22.794 17.4983Z" fill="#FFA0C8" />
                  </svg>
                  <span class="ml-2">
                    "My son was told he is eligible to skip a grade thanks to your program!"
                  </span>
                </p>
                <p class="pg-flex pg-items-center pg-justify-start pg-text-[14px]">
                  <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8617 4.54229C25.1533 8.13848 24.9918 12.0208 21.394 16.3142C17.7962 20.6077 6.12311 24.7828 1.83153 21.1866C-2.46005 17.5904 3.29903 7.30388 6.89682 3.0104C10.4946 -1.28308 16.5702 0.946093 20.8617 4.54229Z" fill="#C399ED" />
                  </svg>
                  <span class="ml-2">
                    "I get to spend more time with my daughter."
                  </span>
                </p>
                <p class="pg-flex pg-items-center pg-justify-start pg-text-[14px]">
                  <svg width="25" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.24628 4.75488C4.82786 -0.126808 8.60527 -0.773049 13.4891 1.80968C18.373 4.3924 24.8108 14.7874 22.2292 19.6691C19.6477 24.5507 8.53769 21.1217 3.65384 18.539C-1.23 15.9563 -0.335303 9.63656 2.24628 4.75488Z" fill="#B4D78B" />
                  </svg>
                  <span class="ml-2">
                    "They are so interested in their lessons that it calms them down."
                  </span>
                </p>
                <p class="pg-flex pg-items-center pg-justify-start pg-text-[14px]">
                  <svg width="25" height="23" viewBox="0 0 21 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.99574 2.20352C12.8522 -0.425159 16.3533 1.13328 18.9832 5.99192C21.613 10.8506 21.2007 23.0707 16.3442 25.6994C11.4877 28.328 4.14784 19.3105 1.518 14.4519C-1.11184 9.59325 3.13925 4.83219 7.99574 2.20352Z" fill="#8FCCD5" />
                  </svg>
                  <span class="ml-2">
                    "We can pause and come back any time... My kids can learn anywhere!""
                  </span>
                </p>
                <p class="pg-flex pg-items-center pg-justify-start pg-text-[13px] pg-ml-7">
                  -Real feedback, from real families.
                </p>
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
      handleGoBack,
      handleSubmit,
      isSignupProcess
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
