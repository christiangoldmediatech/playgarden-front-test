<template>
  <div
    :class="[
      'pg-bg-[url(@/assets/png/play-learn/acuarela-yellow.png)]',
      'pg-bg-[center_right_-8rem]',
      'lg:pg-pb-32'
    ]"
  >
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-mx-auto',
        'pg-max-w-[768px]',
        'pg-px-4',
        'lg:pg-max-w-[1200px]',
      ]"
    >
      <div class="pg-my-6">
        <BackButton @click="handleGoBack" />
      </div>

      <!-- CONTENT -->
      <div
        :class="[
          'pg-grid',
          'pg-grid-cols-1',
          'lg:pg-mt-12',
          'lg:pg-grid-cols-12',
          'lg:pg-gap-24',
        ]"
      >
        <!-- LEFT -->
        <div class="pg-col-span-full lg:pg-col-span-7">
          <StripePayForm
            :loading="isLoading"
            :button-text="'START LEARNING NOW'"
            @click:submit="handleSubmit"
          >
            <template #footer>
              <div
                :class="[
                  'pg-text-center',
                  'pg-text-base',
                  'pg-font-semibold',
                  'pg-text-pg-grey',
                  'pg-opacity-80'
                ]"
              >
                You can cancel your trial and membership anytime from the
                account settings.
              </div>
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
            'lg:pg-col-span-5',
            'lg:pg-mt-0'
          ]"
        >
          <StepTwoCardSummary :value="toggleInfo" @input="toggleInfo = $event" />
          <div class="pg-py-2" />
          <StepTwoCardDetail :value="!toggleInfo" @input="toggleInfo = !$event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import BackButton from '@/components/app/learn-play/BackButton/BackButton.vue'
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import StepTwoCardSummary from '@/components/app/learn-play/StepTwoCardSummary/StepTwoCardSummary.vue'
import StepTwoCardDetail from '@/components/app/learn-play/StepTwoCardDetail/StepTwoCardDetail.vue'
import StripePayForm from '@/components/forms/payment/StripePayForm.vue'
import { usePayment, useSnotifyHelper } from '@/composables'
import { CardData, DataSubscription } from '@/models'

export default defineComponent({
  name: 'AppPlayLearnPayment',

  layout: 'play-learn',

  components: {
    BackButton,
    RegisterForm,
    StepTwoCardSummary,
    StepTwoCardDetail,
    StripePayForm
  },

  setup() {
    const snotify = useSnotifyHelper()
    const router = useRouter()
    const { $axios } = useContext()
    const Payment = usePayment({ axios: $axios })

    const isLoading = ref(false)
    const toggleInfo = ref(true)

    function handleGoBack() {
      router.go(-1)
    }

    async function handleSubmit(data: CardData) {
      try {
        isLoading.value = true

        const dataSubscription: DataSubscription = {
          token: data.token
        }

        if (data.promotion_id) {
          dataSubscription.promotion_id = data.promotion_id
        }

        await Payment.payShorterSubscription(dataSubscription)
        goToNextStep()
      } catch {
        snotify.error('Something went wrong. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    function goToNextStep() {
      router.push({
        name: 'app-play-learn-children',
        query: {
          step: '3',
          process: 'signup'
        }
      })
    }

    return {
      isLoading,
      toggleInfo,
      handleSubmit,
      handleGoBack
    }
  }
})
</script>
