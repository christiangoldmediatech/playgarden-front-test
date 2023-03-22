<template>
  <div
    :class="[
      'pg-bg-[url(@/assets/png/play-learn/acuarela-yellow.png)]',
      'pg-bg-[center_right_-8rem]',
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
          <div>
            <h1 class="main-title lg:pg-text-left pg-text-center">
              <span class="play-style">PLAY</span>
              <span class="ampersand-style">&</span>
              <span class="l-style">L</span><span class="e-style">E</span><span class="a-style">A</span><span class="r-style">R</span><span class="n-style">N</span>
              IS COMPLETELY FREE FOR THE FIRST 15 DAYS!
            </h1>
          </div>

          <div class="pg-my-6">
            <h2 class="subtitle lg:pg-text-left pg-text-center">
              Create an account to start learning, <strong>NO CREDIT CARD REQUIRED!</strong>
            </h2>
          </div>

          <RegisterForm
            :loading="isLoading"
            :is-credit-card-required="true"
            :is-coupon-needed="false"
            :no-terms="false"
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
          <play-learn-promo-info></play-learn-promo-info>
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
  useRoute,
  useRouter,
  onMounted,
  useStore
} from '@nuxtjs/composition-api'
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import PlayLearnPromoInfo from '@/components/app/register/PlayLearnPromoInfo.vue'
import { useAccessorHelper, useSnotifyHelper, useUtmHandler } from '@/composables'
import { useAuth } from '@/composables/users'
import { ParentSignupPayload } from '@/composables/web/signup/types'
import { useParentSignup, useSignupFlow, useSignupStep } from '@/composables/web/signup'
import { useModal } from '@/composables/web/modal'
import { useUTM } from '@/composables/web/utm'
import { SignupType } from '@/composables/users/types'
import { useGtm } from '@/composables/web/gtm'
import { Flow } from '@/composables/users/enums'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'Promo',

  layout: 'play-learn',

  components: {
    BackButton,
    RegisterForm,
    PlayLearnPromoInfo
  },

  setup() {
    const Gtm = useGtm()
    const snotify = useSnotifyHelper()
    const router = useRouter()
    const route = useRoute()
    const storeAccess = useAccessorHelper().auth.signup

    const Utm = useUTM({ route: route.value })
    const Auth = useAuth()
    const Modal = useModal()
    const signUpFlow = useSignupFlow({ route: route.value })
    const ParentSignup = useParentSignup({ auth: Auth, signupFlow: signUpFlow })

    const store = useStore<TypedStore>()
    const UtmHandler = useUtmHandler({ store })

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

    onMounted(() => {
      storeAccess.SET_AB_FLOW(Flow.NOCREDITCARD)
      UtmHandler.setUtmSource()
    })

    const goToNextStep = () => {
      const SignupStep = useSignupStep()

      router.push(
        SignupStep.getStepOneNextStepLocation({
          signupType,
          utmContent: Utm.utmContent.value,
          abFlow: signUpFlow.abFlow.value
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

<style lang="scss" scoped>
.main-title {
  font-weight: 700;
  letter-spacing: 4.8px;
  font-size: 38px;

  @media (max-width: $breakpoint-sm) {
    font-size: 30px;
  }

}

.play-style {
  color: #6EC55A;
}

.ampersand-style {
  color: #F89838;
}

.l-style {
  color: #FFB9D6;
}

.e-style {
  color: #F6E72A;
}

.a-style {
  color: #B2E68D;
}

.r-style {
  color: #9ACED4;
}

.n-style {
  color: #C399ED;
}

.subtitle {
  font-weight: 400;
  font-size: 19px;
  line-height: 36px;
  color: #606060;
  mix-blend-mode: normal;
  opacity: 0.49;
}
</style>
