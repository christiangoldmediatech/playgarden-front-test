<template>
  <div class="px-4">
    <!-- HEADING -->
    <div :class="['pg-mt-6', 'pg-inline']">
      <UnderlinedTitle
        text="SHIPPING ADDRESS"
        font-size="40px"
        font-size-mobile="20px"
      />
    </div>

    <div class="mt-4 pg-text-lg pg-font-[600] pg-text-[#606060]">
      We use this information to send you Playgarden Prep educational materials.
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
      <div class="pg-col-span-full lg:pg-col-span-6">
        <ShippingAddressForm @click:submit="handleSubmit" @click:skip="$emit('click:change-step', 3)" />
      </div>

      <!-- RIGHT -->
      <div
        :class="[
          'pg-col-span-full',
          'pg-flex',
          'pg-justify-center',
          'lg:pg-col-span-6',
          'height-mobile'
        ]"
      >
        <CardPlaygarden
          :value="showCardPlaygarden"
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
import CardPlaygarden from '@/components/app/register/CardPlaygarden.vue'
import NormalTitle from '@/plugins/globalPartials/NormalTitle.vue'
import ShippingAddressForm from './ShippingAddressForm.vue'

export default defineComponent({
  name: 'ShippingAddressStep',

  components: {
    ShippingAddressForm,
    NormalTitle,
    CardPlaygarden,
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

    const showCardPlaygarden = ref(true)

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
      emit('click:change-step', 3)
    }

    return {
      loading,
      emailValidated,
      token,
      showCardPlaygarden,
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
