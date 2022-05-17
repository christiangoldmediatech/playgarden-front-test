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
        'lg:pg-max-w-[1300px]',
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
          'lg:pg-leading-[48px]',
        ]"
      >
        <img src="@/assets/svg/play-learn/play-learn-logo.svg" class="pg-mr-2 pg-h-14 pg-mb-[-16px] pg-text-black">
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
          'lg:pg-gap-24',
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
import { defineComponent, ref, useRouter, useStore } from '@nuxtjs/composition-api'
import BackButton from '@/components/app/learn-play/BackButton/BackButton.vue'
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import StepOneCard from '@/components/app/learn-play/StepOneCard/StepOneCard.vue'
import { useAuth, useNotification, useSnotifyHelper } from '@/composables'
import { SignupData, TypedStore, UserFlow } from '@/models'

export default defineComponent({
  name: 'AuthPlayLearnIndex',

  layout: 'learn-play',

  components: {
    BackButton,
    RegisterForm,
    StepOneCard
  },

  setup() {
    const snotify = useSnotifyHelper()
    const store = useStore<TypedStore>()
    const router = useRouter()
    const Auth = useAuth({ store })
    const Notification = useNotification({ store })

    const isLoading = ref(false)

    function handleGoBack() {
      router.go(-1)
    }

    async function handleSubmit(data: SignupData) {
      try {
        isLoading.value = true

        if (!Auth.isUserLoggedIn.value) {
          await Auth.signup({ ...data, flow: UserFlow.CREDITCARD })
          snotify.success('Welcome to Playgarden Prep!')
        }

        goToNextStep()
      } catch (e: any) {
        const data = e?.response?.data

        if (data?.statusCode === 409) {
          if (data?.message === 'Email already exists') {
            Notification.setIsEmailConflictModalVisible(true)
          }

          if (data?.message === 'Account Canceled') {
            Notification.setIsAccountInactiveModalVisible(true)
          }
        }
      } finally {
        isLoading.value = false
      }
    }

    function goToNextStep() {
      router.push({
        name: 'app-play-learn-payment',
        query: {
          step: '2',
          process: 'signup'
        }
      })
    }

    return {
      isLoading,
      handleSubmit,
      handleGoBack
    }
  }
})
</script>
