<template>
  <v-row
    class="flex-column flex-md-row"
    justify="center"
    no-gutters
    data-test-id="signup-content"
  >
    <v-col cols="12" class="ml-md-14">
      <p class="text-center text-md-left">
        <UnderlinedTitle
          class="pg-box-decoration-clone text-h6 text-md-h4 ml-sm-4"
          text="PLAYGARDEN PREP'S ONLINE PRESCHOOL IS COMPLETELY FREE FOR THE FIRST 15 DAYS!"
        />
      </p>
    </v-col>

    <v-col
      class="px-sm-12 px-6 mt-1 mt-md-12"
      cols="12"
      sm="12"
      xs="12"
      md="6"
      lg="6"
      xl="6"
    >
      <p class="text-center text-md-left mt-md-n8">
        <span class="subtitle-text info-color-signup">
          Create an account to start learning
          <span v-if="!isCreditCardRequired">. NO CREDIT CARD REQUIRED!</span>
        </span>
      </p>

      <RegisterForm
        :email-validated="emailValidated"
        :in-invitation-process="inInvitationProcess"
        :loading="loading"
        :is-credit-card-required="isCreditCardRequired"
        @click:submit="onSubmit"
      />
    </v-col>

    <v-col cols="12" md="6" lg="6">
      <template>
        <v-row
          :class="
            $vuetify.breakpoint.smAndUp
              ? 'mt-4 background-card'
              : 'background-card-mobile pt-14 px-8'
          "
        >
          <v-col cols="12" class="my-sm-6 px-sm-10">
            <v-layout row wrap align-center justify-center>
              <v-card
                class="mx-0 mx-md-10 !pg-shadow-[0px_8px_24px_rgba(0,0,0,0.15)]"
              >
                <v-container>
                  <v-layout column align-center justify-center>
                    <CardInfo />
                  </v-layout>
                </v-container>
              </v-card>
            </v-layout>
          </v-col>
        </v-row>
      </template>
    </v-col>
  </v-row>
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
    CardInfo
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

    async function onSubmit(data: ParentSignupPayload): Promise<void> {
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

    return {
      loading,
      emailValidated,
      token,
      isCreditCardRequired: SignupFlow.isCreditCardRequired,
      inInvitationProcess: SignupInvitation.inInvitationProcess,
      goToNextStep,
      onSubmit
    }
  }
})
</script>
