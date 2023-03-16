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
            :is-address-required="true"
            :is-credit-card-required="isCreditCardRequired"
            :is-coupon-needed="false"
            :no-terms="noTerms"
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
            'height-mobile',
          ]"
        >
          <CardInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/23189711.js"></script>

<!-- End of HubSpot Embed Code -->
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
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import { useSnotifyHelper } from '@/composables'
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
  name: 'StepOne',

  components: {
    RegisterForm,
    CardInfo,
    BackButton
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

  setup() {
    const router = useRouter()
    const route = useRoute()
    const snotify = useSnotifyHelper()

    const Auth = useAuth()
    const Modal = useModal()
    const Utm = useUTM({ route: route.value })
    const SignupInvitation = useSignupInvitation({ route: route.value })

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
      const currentPlanType = shouldPickPlanOnSignup.value ? undefined : signupType

      router.push(
        SignupStep.getStepOneNextStepLocation({
          signupType: currentPlanType,
          abFlow: SignupFlow.abFlow.value,
          utmContent: Utm.utmContent.value,
          authFlow: SignupFlow.authFlow.value
        })
      )
    }

    async function handleSubmit(data: ParentSignupPayload): Promise<void> {
      try {
        loading.value = true
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

<style lang="scss" scoped>
.height-mobile {
  min-height: 475px;
}
</style>
