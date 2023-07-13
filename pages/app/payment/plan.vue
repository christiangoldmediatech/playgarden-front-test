<template>
  <v-main class="background-card-learn-play">
    <v-container fluid>
      <v-row class="mb-6" no-gutters>
        <v-col cols="12" class="mt-4">
          <!-- Default Back Button -->
          <v-btn
            v-if="!inSignUpProcess"
            color="accent"
            class="text-none"
            nuxt
            :to="{ name: 'app-virtual-preschool' }"
            text
          >
            <v-icon left>
              mdi-less-than
            </v-icon>

            {{ $t('paymentPlan.goBack') }}
          </v-btn>
        </v-col>

        <!-- IN SIGNUP PROCESS -->
        <v-col v-if="inSignUpProcess" cols="12" class="text-center mt-4">
          <!-- TITLE -->
          <div
            class="pg-text-4xl pg-text-accent pg-font-bold pg-tracking-[1px] v2-font"
          >
            {{ $t('paymentPlan.title') }}
          </div>

          <!-- TEXT -->
          <div
            class="mt-8 mb-6 text-body-1 text-md-h5 pg-m-auto pg-max-w-[900px]"
          >
            <div>{{ $t('paymentPlan.description1') }}</div>
            <div>
              {{ $t('paymentPlan.description2') }}
            </div>
            <div>{{ $t('paymentPlan.description3') }}</div>
          </div>
        </v-col>

        <!-- TRIAL ENDED NO MORE THAN 30 DAYS AGO -->
        <v-col
          v-else-if="!trialEndedTooLongAgo"
          cols="12"
          class="text-center mt-4"
        >
          <!-- TITLE -->
          <div
            class="pg-text-4xl pg-text-primary pg-font-bold pg-tracking-[1px] v2-font"
          >
            {{
              isTrialExpired
                ? $t('paymentPlan.trialExpired')
                : $t('paymentPlan.trialExpiring')
            }}
          </div>

          <!-- TEXT -->
          <div
            class="mt-8 mb-6 text-body-1 text-md-h5 pg-m-auto pg-max-w-[900px]"
          >
            {{ $t('paymentPlan.trialPeriod1') }}
            {{ isTrialExpired ? $t('paymentPlan.trialEnded') : $t('paymentPlan.trialWillEnd') }} {{ $t('paymentPlan.trialPeriod2') }}
            <span class="pg-text-primary pg-font-semibold v2-font">
              {{ lastDayOfTrial }}.
            </span>
            {{ $t('paymentPlan.trialPeriod3') }} {{ isTrialExpired ? $t('paymentPlan.trialWere') : $t('paymentPlan.trialCurrently') }} {{ $t('paymentPlan.trialPeriod4') }}
            <span class="accent--text font-weight-bold">
              {{ userInfo.planSelected.name }}
            </span>
            {{ $t('paymentPlan.trialPeriod5') }} {{ isTrialExpired ? $t('paymentPlan.trialEnded') : $t('paymentPlan.trialEnds') }} {{ $t('paymentPlan.trialPeriod6') }}
            {{ isTrialExpired ? $t('paymentPlan.trialWere') : $t('paymentPlan.trialWillBe') }} {{ $t('paymentPlan.trialPeriod7') }}
            <span class="accent--text font-weight-bold">
              {{ userInfo.planSelected.name }}
            </span>
            {{ $t('paymentPlan.trialPeriod8') }}
          </div>
        </v-col>

        <v-col cols="12" class="mt-16">
          <SubscriptionPlanSelection
            class="mt-md-n6"
            :in-sign-up-process="inSignUpProcess"
            @click:submit="handleSubmit"
            @initialized="initialized = true"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'

import { useVuetifyHelper } from '@/composables'
import { useAuth, useUser } from '@/composables/users'
import { useNotification } from '@/composables/web/notification'
import { useSignupFlow, useSignupStep } from '@/composables/web/signup'
import { useUTM } from '@/composables/web/utm'
import { SignupType } from '@/composables/users/types'

export default defineComponent({
  name: 'Plan',

  components: {
    SubscriptionPlanSelection
  },

  setup() {
    const vuetify = useVuetifyHelper()
    const route = useRoute()
    const router = useRouter()

    const Auth = useAuth()
    const User = useUser()
    const Notification = useNotification()
    const SignupStep = useSignupStep()
    const Utm = useUTM({ route: route.value })

    const SignupFlow = useSignupFlow({
      route: route.value
    })

    const initialized = ref(false)

    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const signupType = computed(() =>
      Auth.isPlayAndLearnUser.value
        ? SignupType.LEARN_AND_PLAY
        : SignupType.PLAYGARDEN
    )

    const inSignUpProcess = computed<boolean>(() => {
      const { query } = route.value
      return query.process === 'signup' && query.step === '2'
    })

    function handleSubmit(): void {
      try {
        if (inSignUpProcess.value) {
          router.push(
            SignupStep.getStepTwoNextStepLocation({
              signupType: signupType.value,
              abFlow: SignupFlow.abFlow.value,
              utmContent: Utm.utmContent.value
            })
          )
        }

        User.setPlanChoosen()
        Notification.isTrialExpiringRibbonVisible.value = false
      } finally {
        User.getUserInfo()
      }
    }

    // TODO: Investigate what role 4 means.
    onMounted(() => {
      if (User.userInfo.value?.role.id === 4) {
        router.push({ name: 'app-account-index' })
      }
    })

    return {
      isMobile,
      initialized,
      inSignUpProcess,
      isTrialExpired: User.isTrialExpired,
      lastDayOfTrial: User.lastDayOfTrial,
      trialEndedTooLongAgo: User.trialEndedTooLongAgo,
      userInfo: User.userInfo,
      isUserInTrial: Auth.isUserInTrial,
      handleSubmit
    }
  }
})
</script>
