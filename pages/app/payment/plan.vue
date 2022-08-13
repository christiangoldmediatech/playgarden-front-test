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

        <!-- IN SIGNUP PROCESS -->
        <v-col v-if="inSignUpProcess" cols="12" class="text-center mt-4">
          <!-- TITLE -->
          <div
            class="pg-text-4xl pg-text-accent pg-font-bold pg-tracking-[1px] v2-font"
          >
            Enrollment Plans
          </div>

          <!-- TEXT -->
          <div
            class="mt-8 mb-6 text-body-1 text-md-h5 pg-m-auto pg-max-w-[900px]"
          >
            <div>Choose the plan that works best for your family!</div>
            <div>
              All of our plans are monthly subscriptions offering different
              access to Playgarden Prep's curriculum and teachers.
            </div>
            <div>You can also pay annually for important savings!</div>
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
                ? 'YOUR TRIAL PERIOD HAS EXPIRED'
                : 'YOUR TRIAL PERIOD IS EXPIRING'
            }}
          </div>

          <!-- TEXT -->
          <div
            class="mt-8 mb-6 text-body-1 text-md-h5 pg-m-auto pg-max-w-[900px]"
          >
            Your trial period
            {{ isTrialExpired ? 'ended' : 'will end' }} on
            <span class="pg-text-primary pg-font-semibold v2-font">
              {{ lastDayOfTrial }}.
            </span>
            You {{ isTrialExpired ? 'were' : 'are currently' }} trialing the
            <span class="accent--text font-weight-bold">
              {{ userInfo.planSelected.name }}
            </span>
            plan. After your trial {{ isTrialExpired ? 'ended' : 'ends' }} you
            {{ isTrialExpired ? 'were' : 'will be' }} automatically placed into
            the
            <span class="accent--text font-weight-bold">
              {{ userInfo.planSelected.name }}
            </span>
            monthly plan. If you would like to trial a different plan, you may
            do so below!
          </div>
        </v-col>

        <v-col cols="12" class="mt-16">
          <SubscriptionPlanSelection
            class="mt-md-n6"
            @click:submit="handleSubmit"
            @initialized="initialized = true"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'

import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'

import { useAccessorHelper, useVuetifyHelper } from '@/composables'
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
    const store = useAccessorHelper()

    const Auth = useAuth({ store: store.auth })
    const User = useUser({ store: store.auth })
    const Notification = useNotification({ store: store.notifications })
    const SignupStep = useSignupStep()
    const Utm = useUTM({ route: route.value })
    const SignupFlow = useSignupFlow({ route: route.value, store: store.auth.signup })

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

    const isTrialExpired = computed<boolean>(() => {
      if (!User.userInfo.value?.trialEnd) {
        return true
      }

      return dayjs().isAfter(dayjs(User.userInfo.value.trialEnd))
    })

    const lastDayOfTrial = computed<string>(() => {
      if (!User.userInfo.value?.trialEnd) {
        return ''
      }

      return dayjs(User.userInfo.value.trialEnd).format('MMMM DD, YYYY')
    })

    const trialEndedTooLongAgo = computed<boolean>(() => {
      if (!User.userInfo.value?.trialEnd) {
        return true
      }

      const expiredMoreThan30DaysAgo =
        dayjs().diff(dayjs(User.userInfo.value.trialEnd)) > 30

      return isTrialExpired.value && expiredMoreThan30DaysAgo
    })

    function handleSubmit(): void {
      try {
        if (inSignUpProcess.value) {
          SignupStep.getStepTwoNextStepLocation({
            signupType: signupType.value,
            abFlow: SignupFlow.abFlow.value,
            utmContent: Utm.utmContent.value
          })
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
      isTrialExpired,
      lastDayOfTrial,
      trialEndedTooLongAgo,
      userInfo: User.userInfo,
      isUserInTrial: Auth.isUserInTrial,
      handleSubmit
    }
  }
})
</script>
