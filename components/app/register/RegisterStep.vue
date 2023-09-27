<template>
  <div class="px-2 pb-6">
    <!-- HEADING -->
    <div :class="['pg-mt-6', 'pg-inline']">
      <NormalTitle
        :text="$t('register.title')"
        font-size="40px"
        font-size-mobile="20px"
      />
    </div>

    <div class="pg-text-xl pg-text-[rgba(96,96,96,0.5)]">
      {{ $t('register.subtitle1') }}

      <div v-if="hasValidLibraryCard" class="pg-font-semibold pg-mt-5">
        {{ $t('register.libraryCard.yourLibraryCardNum') }}
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
          :white-btn="true"
          :btn-text="$t('register.btnText')"
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
          'height-mobile',
        ]"
      >
        <CardInfo :title="$t('register.cardInfo.altTitle')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRoute
} from '@nuxtjs/composition-api'
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import CardInfo from '@/components/app/register/CardInfo.vue'
import { useToastHelper, useAccessorHelper, useLanguageHelper } from '@/composables'
import { useModal } from '@/composables/web/modal'
import {
  useParentSignup,
  useSignupFlow,
  useSignupInvitation
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

  emits: ['click:change-step'],

  setup(_, { emit }) {
    const route = useRoute()
    const toast = useToastHelper()
    const language = useLanguageHelper()

    const Auth = useAuth()
    const Modal = useModal()
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

    const loading = ref(false)
    const emailValidated = ref('')
    const token = route.value.query.token
    const signupType = SignupType.PLAYGARDEN

    function goToNextStep() {
      emit('click:change-step')
    }

    const handleSubmit = async (data: ParentSignupPayload) => {
      try {
        loading.value = true
        await ParentSignup.signup(data, signupType)
        toast.success(language.t('register.success'))
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
  @media screen and (min-width: $breakpoint-xs) {
    min-height: 475px;
  }
}
</style>
