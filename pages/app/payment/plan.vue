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

            Go Back to Home
          </v-btn>
        </v-col>

        <v-col cols="12" class="text-center mt-4">
          <!-- TITLE -->
          <div
            class="pg-text-4xl pg-text-accent pg-font-bold pg-tracking-[1px] v2-font"
          >
            Enrollment Plans
          </div>

          <!-- TEXT -->
          <div
            class="mt-8 mb-0 text-body-1 text-md-h5 pg-m-auto pg-max-w-[900px]"
          >
            <div>Choose the plan that works best for your family!</div>
            <div>
              All our plans are <strong>FREE for the first 15 days</strong> followed by monthly payments, which you can cancel anytime.
            </div>
            <div>We offer important discounts to those families that commit for a semester of school.</div>
          </div>
        </v-col>

        <v-col cols="12" class="mt-6">
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
