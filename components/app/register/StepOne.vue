<template>
  <div>
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-mx-auto',
        'pg-max-w-[768px]',
        'pg-px-4',
        'lg:pg-pb-16',
        'lg:pg-px-8',
        'lg:pg-max-w-[1300px]',
        'lg:pg-bg-[url(@/assets/png/green-whirl.png)]',
        'lg:pg-bg-[right_bottom]',
        'lg:pg-bg-[length:45%_75%]'
      ]"
    >
      <div class="md:pg-mt-24">
        <BackButton @click="handleGoBack" />
      </div>

      <!-- HEADING -->
      <div :class="['pg-mt-6', 'pg-inline']">
        <UnderlinedTitle
          text="CREATE AN ACCOUNT TO START LEARNING!"
          font-size="40px"
          font-size-mobile="20px"
        />
      </div>

      <div class="pg-text-xl pg-text-black pg-opacity-50">
        Are you excited for a fun-filled day of learning?
        <span v-if="!isCreditCardRequired"> NO CREDIT CARD REQUIRED!</span>
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
            :email-validated="emailValidated"
            :in-invitation-process="inInvitationProcess"
            :loading="loading"
            :is-credit-card-required="isCreditCardRequired"
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
          <CardInfo />
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
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import CardInfo from '@/components/app/register/CardInfo.vue'
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import { useAccessorHelper, useSnotifyHelper } from '@/composables'
import { useUTM } from '@/composables/web/utm'
import { useModal } from '@/composables/web/modal'
import {
  useParentSignup,
  useSignupFlow,
  useSignupInvitation,
  useSignupSteps
} from '@/composables/web/signup'
import { useAuth } from '@/composables/users'
import { ParentSignupPayload } from '@/composables/web/signup/types'

export default defineComponent({
  name: 'StepOne',

  components: {
    RegisterForm,
    CardInfo,
    BackButton
  },

  setup() {
    const store = useAccessorHelper()
    const router = useRouter()
    const route = useRoute()
    const snotify = useSnotifyHelper()

    const Auth = useAuth({ store: store.auth })
    const Modal = useModal({ store: store.notifications })
    const Utm = useUTM({ route: route.value })
    const SignupInvitation = useSignupInvitation({ route: route.value })

    const SignupFlow = useSignupFlow({
      route: route.value,
      store: store.auth.signup
    })

    const ParentSignup = useParentSignup({
      store: store.auth.signup,
      auth: Auth,
      signupFlow: SignupFlow
    })

    const loading = ref(false)
    const emailValidated = ref('')
    const token = route.value.query.token

    function goToNextStep() {
      const SignupSteps = useSignupSteps()

      router.push(
        SignupSteps.getStepOneNextStepLocation({
          abFlow: SignupFlow.abFlow.value,
          utmContent: Utm.utmContent.value
        })
      )
    }

    async function handleSubmit(data: ParentSignupPayload): Promise<void> {
      try {
        loading.value = true
        await ParentSignup.signup(data)
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
        loading.value = false
      }
    }

    function handleGoBack() {
      window.open('https://playgardenonline.com/', '_self')
    }

    return {
      loading,
      emailValidated,
      token,
      isCreditCardRequired: SignupFlow.isCreditCardRequired,
      inInvitationProcess: SignupInvitation.inInvitationProcess,
      handleGoBack,
      goToNextStep,
      handleSubmit
    }
  }
})
</script>
