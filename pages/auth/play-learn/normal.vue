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
        'lg:pg-max-w-[1300px]'
      ]"
    >
      <div class="pg-mt-6">
        <BackButton @click="handleGoBack" />
      </div>

      <!-- HEADING -->
      <div
        :class="[
          'pg-mt-6',
          'pg-inline',
          'pg-text-3xl',
          'pg-font-bold',
          'pg-leading-9',
          'lg:pg-tracking-[4.8px]',
          'lg:pg-leading-[48px]'
        ]"
      >
        <img
          src="@/assets/svg/play-learn/play-learn-logo.svg"
          class="pg-mr-2 pg-h-14 pg-mb-[-16px] pg-text-black"
        />
        IS COMPLETELY FREE FOR THE FIRST 15 DAYS!
      </div>

      <div class="pg-text-xl pg-text-black pg-opacity-50">
        Create an account to start learning
      </div>

      <!-- CONTENT -->
      <div
        :class="[
          'pg-grid',
          'pg-grid-cols-1',
          'pg-mt-8',
          'lg:pg-grid-cols-12',
          'lg:pg-gap-24'
        ]"
      >
        <!-- LEFT -->
        <div class="pg-col-span-full lg:pg-col-span-7">
          <RegisterForm
            :loading="isLoading"
            :is-credit-card-required="true"
            @click:submit="handleSubmit"
          />
        </div>

        <!-- RIGHT -->
        <div
          :class="[
            'pg-col-span-full',
            'pg-flex',
            'pg-justify-center',
            'pg-mt-14',
            'lg:pg-col-span-5',
            'lg:pg-mt-0'
          ]"
        >
          <StepOneCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import StepOneCard from '@/components/app/learn-play/StepOneCard/StepOneCard.vue'
import { useSnotifyHelper } from '@/composables'
import { useAuth } from '@/composables/users'
import { ParentSignupPayload } from '@/composables/web/signup/types'
import { useParentSignup, useSignupStep } from '@/composables/web/signup'
import { useModal } from '@/composables/web/modal'
import { useUTM } from '@/composables/web/utm'
import { SignupType } from '@/composables/users/types'
import { useGtm } from '@/composables/web/gtm'

export default defineComponent({
  name: 'AuthPlayLearnIndex',

  layout: 'play-learn',

  components: {
    BackButton,
    RegisterForm,
    StepOneCard
  },

  setup() {
    const Gtm = useGtm()
    const snotify = useSnotifyHelper()
    const router = useRouter()
    const route = useRoute()

    const Utm = useUTM({ route: route.value })
    const Auth = useAuth()
    const Modal = useModal()
    const ParentSignup = useParentSignup({ auth: Auth })

    const isLoading = ref(false)
    const signupType = SignupType.LEARN_AND_PLAY

    Gtm.parentPage({
      conversionID: '959213252',
      conversionLabel: 'QAn5COr85PoBEMTdsckD'
    })

    const handleGoBack = () => {
      window.open('https://playgardenprep.com/play-and-learn/', '_self')
    }

    const handleSubmit = async (data: ParentSignupPayload) => {
      try {
        isLoading.value = true
        await ParentSignup.signup(data, signupType)
        snotify.success('Welcome to Playgarden Prep!')
        goToNextStep()
      } catch (e) {
        const error = e as any
        const data = error?.response?.data

        if (data?.statusCode === 409) {
          if (data?.message === 'Email already exists') {
            Modal.isEmailConflictModalVisible.value = true
          }

          if (data?.message === 'Account Canceled') {
            Modal.isAccountInactiveModalVisible.value = true
          }
        }
      } finally {
        isLoading.value = false
      }
    }

    const goToNextStep = () => {
      const SignupStep = useSignupStep()
      router.push(
        SignupStep.getStepOneNextStepLocation({
          signupType,
          utmContent: Utm.utmContent.value
        })
      )
    }

    return {
      isLoading,
      handleSubmit,
      handleGoBack
    }
  }
})
</script>
