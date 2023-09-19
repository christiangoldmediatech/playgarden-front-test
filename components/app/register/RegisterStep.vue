<template>
  <div class="px-2">
    <!-- HEADING -->
    <div :class="['pg-mt-6', 'pg-inline']">
      <NormalTitle
        text="CREATE AN ACCOUNT TO START LEARNING!"
        font-size="40px"
        font-size-mobile="20px"
      />
    </div>

    <div class="pg-text-xl pg-text-[rgba(96,96,96,0.5)]">
      Are you excited for a fun-filled day of learning?

      <div v-if="hasValidLibraryCard" class="pg-font-semibold pg-mt-5">
        Your library card number:
        <span class="pg-text-[#68C453] pg-font-bold">{{ libraryCardNumber }}</span>
      </div>
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
          :email-validated="emailValidated"
          :in-invitation-process="inInvitationProcess"
          :loading="loading"
          :is-address-required="false"
          :is-credit-card-required="isCreditCardRequired"
          :is-coupon-needed="false"
          :is-phone-number-required="false"
          :no-terms="noTerms"
          :white-btn="true"
          :btn-text="'LOGIN'"
          @click:submit="handleSubmit"
        />
      </div>

      <!-- RIGHT -->
      <div
        :class="[
          'pg-col-span-full',
          'pg-flex',
          'pg-justify-center',
          'lg:pg-col-span-5',
          'height-mobile'
        ]"
      >
        <CardInfo title="It's the easiest way to give your child an immersive education at home!" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import CardInfo from '@/components/app/register/CardInfo.vue'
import { useToastHelper, useAccessorHelper } from '@/composables'
import { useUTM } from '@/composables/web/utm'
import { useModal } from '@/composables/web/modal'
import {
  useParentSignup,
  useSignupFlow,
  useSignupInvitation,
  useSignupStep
} from '@/composables/web/signup'
import { useAuth } from '@/composables/users'
import { ParentSignupPayload } from '@/composables/web/signup/types'
import { SignupType } from '@/composables/users/types'

export default defineComponent({
  name: 'RegisterStep',

  components: {
    RegisterForm,
    CardInfo
  },

  props: {
    isCouponNeeded: {
      type: Boolean,
      default: true
    },
    noTerms: {
      type: Boolean,
      default: true
    }
  },

  emits: ['click:change-step'],

  setup(_, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const toast = useToastHelper()

    const Auth = useAuth()
    const Modal = useModal()
    const Utm = useUTM({ route: route.value })
    const SignupInvitation = useSignupInvitation({ route: route.value })

    const signupStore = useAccessorHelper().auth.signup
    const hasValidLibraryCard = signupStore.hasValidLibraryCard
    const libraryCardNumber = signupStore.libraryCardNumber

    const SignupFlow = useSignupFlow({
      route: route.value
    })

    const ParentSignup = useParentSignup({
      auth: Auth,
      signupFlow: SignupFlow
    })

    const shouldPickPlanOnSignup = computed(() => {
      return route.value.query.action === 'pick-plan'
    })

    const loading = ref(false)
    const emailValidated = ref('')
    const token = route.value.query.token
    const signupType = SignupType.PLAYGARDEN

    function goToNextStep() {
      const SignupStep = useSignupStep()
      const currentPlanType = shouldPickPlanOnSignup.value
        ? undefined
        : signupType

      router.push(
        SignupStep.getStepOneNextStepLocation({
          signupType: currentPlanType,
          abFlow: SignupFlow.abFlow.value,
          utmContent: Utm.utmContent.value,
          authFlow: SignupFlow.authFlow.value
        })
      )
    }

    const handleSubmit = (data: ParentSignupPayload) => {
      // try {
      //   loading.value = true
      //   await ParentSignup.signup(data, signupType)
      //   toast.success('Welcome to Playgarden Prep!')
      //   goToNextStep()
      // } catch (e) {
      //   const error = e as any
      //   const data = error?.response?.data

      //   if (data?.statusCode === 409) {
      //     if (data?.message === 'Email already exists') {
      //       Modal.isEmailConflictModalVisible.value = true
      //     }

      //     if (data?.message === 'Account Canceled') {
      //       Modal.isAccountInactiveModalVisible.value = true
      //     }
      //   }
      // } finally {
      //   loading.value = false
      // }
      emit('click:change-step', 2)
    }

    return {
      loading,
      emailValidated,
      token,
      isCreditCardRequired: SignupFlow.isCreditCardRequired,
      inInvitationProcess: SignupInvitation.inInvitationProcess,
      hasValidLibraryCard,
      libraryCardNumber,
      goToNextStep,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.height-mobile {
  min-height: 475px;
}
</style>
