<template>
  <v-row class="flex-column flex-md-row" justify="center" no-gutters>
    <v-col cols="12" class="ml-md-14">
      <p class="text-center text-md-left">
        <underlined-title
          class="text-h6 text-md-h4 ml-sm-4"
          text="PLAYGARDEN PREP ONLINE IS COMPLETELY FREE!"
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

      <register-form
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
              <v-card class="mx-0 mx-md-10 custom-shadow">
                <v-container>
                  <v-layout column align-center justify-center>
                    <card-info />
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

<script>
import { defineComponent, useRoute, useRouter } from '@nuxtjs/composition-api'
import { mapActions, mapGetters } from 'vuex'
import { useSignup } from '@/composables/use-signup.composable'
import RegisterForm from '@/components/forms/auth/RegisterForm.vue'
import CardInfo from '@/components/app/register/CardInfo.vue'
import { UserFlow } from '@/models'
import { useUTM } from '@/composables/utm/use-utm.composable'

export default defineComponent({
  name: 'StepOne',

  components: {
    RegisterForm,
    CardInfo
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const utmContent = useUTM({ route: route.value })

    const { abFlow, isCreditCardRequired, setupABFlow } = useSignup({
      route: route.value
    })

    setupABFlow()

    const goToNextStep = () => {
      switch (abFlow.value) {
        case UserFlow.CREDITCARD:
          router.push({
            name: 'app-normal-payment',
            query: {
              step: '2',
              process: 'signup',
              ...utmContent.value
            }
          })
          break
        case UserFlow.NOCREDITCARD:
          router.push({
            name: 'app-children',
            query: {
              step: '3',
              process: 'signup',
              ...utmContent.value
            }
          })
          break
      }
    }

    return {
      abFlow,
      isCreditCardRequired,
      goToNextStep
    }
  },

  data: vm => ({
    loading: false,
    emailValidated: null,
    token: vm.$route.query.token
  }),

  computed: {
    ...mapGetters('auth', ['getUserInfo', 'isUserLoggedIn']),
    inInvitationProcess() {
      const { query } = this.$route
      return Boolean(
        (query.process === 'invitation-caregiver' ||
          query.process === 'invitation-playdate') &&
          (query.email || query.phone) &&
          query.token
      )
    },
    signupProcess() {
      if (
        this.inInvitationProcess &&
        this.$route.query.process === 'invitation-caregiver'
      ) {
        return 'CAREGIVER'
      }
      return 'PARENT'
    },
    signupProcessCaregiver() {
      return this.signupProcess === 'CAREGIVER'
    }
  },

  beforeMount() {
    if (this.userSocialData) {
      this.emailValidated = this.userSocialData.email
    }
  },

  methods: {
    ...mapActions('auth/signup', {
      newParent: 'signup',
      validateEmail: 'signupEmail',
      updateParentRegister: 'signupToken'
    }),
    ...mapActions('caregiver', { newCaregiver: 'signup' }),
    ...mapActions('auth', ['setPlaydateInvitationToken']),

    async onSubmit(data) {
      try {
        this.loading = true
        if (!this.isUserLoggedIn) {
          await this.registerProcess(
            this.signupProcessCaregiver ? { data, token: this.token } : data
          )
          this.$snotify.success('Welcome to Playgarden Prep!')
        }
        this.goToNextStep()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    async registerProcess(data) {
      return await this.newParent({ ...data, flow: this.abFlow })
    }
  }
})
</script>

<style lang="scss" scoped>
.image {
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    max-width: 90%;
  }
  &.mobile {
    max-height: 250px;
  }
}
.form {
  max-width: 500px;
}
.text-orange-info {
  background-color: var(--v-accent-base) !important;
  color: var(--v-white-base) !important;
  height: 19px;
  font-size: 15px;
}
.text-orange-info::v-deep.v-chip .v-chip__content {
  color: var(--v-white-base) !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3.15px;
  line-height: 1.48;
  background-color: var(--v-accent-base) !important;
}
.text-orange-info::v-deep.v-chip--label {
  border-radius: 0px !important;
}
.custom-shadow {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
