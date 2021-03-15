<template>
  <v-row
    no-gutters
  >
    <v-col>
      <v-row
        class="flex-column flex-md-row"
        justify="center"
        no-gutters
      >
        <v-col cols="12" :class="{ 'ml-14': $vuetify.breakpoint.mdAndUp }">
          <p class="text-center text-md-left">
            <underlined-title :class="(!$vuetify.breakpoint.smAndUp) ? 'text-h6 text-md-h4' : 'text-h6 text-md-h4 ml-4'" text="PLAYGARDEN PREP ONLINE IS COMPLETELY FREE FOR 30 DAYS!" />
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
          <p class="text-center text-md-left" :class="{ 'mt-n8': $vuetify.breakpoint.mdAndUp }">
            <span class="subtitle-text info-color-signup">
              Create an account to start learning
            </span>
          </p>

          <register-form
            :email-validated="emailValidated"
            :in-invitation-process="inInvitationProcess"
            :loading="loading"
            @click:submit="onSubmit"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
          lg="6"
          xl="6"
        >
          <template>
            <v-row>
              <v-col v-if="!showDetailFreeTrial" cols="12" class="mt-4">
                <v-btn
                  block
                  text
                  @click="showDetailFreeTrial = !showDetailFreeTrial"
                >
                  <p>
                    <img
                      src="@/assets/png/gift-icon.png"
                      class="mr-2"
                      width="18px"
                    >
                    <span :class="($vuetify.breakpoint.smAndUp) ? 'free-trial' : 'free-trial-mobile'">
                      YOUR 30 DAY FREE TRIAL
                    </span> <br />
                    <span :class="($vuetify.breakpoint.smAndUp) ? 'free-trial' : 'free-trial-mobile'">
                      INCLUDES THE PREMIUM + PLAN
                    </span>
                  </p>
                  <v-icon class="ml-2">
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col class="hr-line">
                <v-divider />
              </v-col>
            </v-row>
            <v-row v-if="showDetailFreeTrial" :class="($vuetify.breakpoint.smAndUp) ? 'mt-4 background-card' : 'background-card-mobile pt-14 px-8'">
              <v-col cols="12" :class="(!$vuetify.breakpoint.smAndUp) ? '' : 'mt-10 mb-10 px-10'">
                <v-layout row wrap align-center justify-center>
                  <v-card class="elevation-0 mx-10">
                    <v-container>
                      <v-layout column align-center justify-center>
                        <card-info @toggleCard="showDetailFreeTrial = !showDetailFreeTrial" />
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-layout>
              </v-col>
            </v-row>
          </template>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RegisterForm from '@/components/forms/auth/RegisterForm'
import CardInfo from './CardInfo'
export default {
  name: 'StepOne',
  components: {
    RegisterForm,
    CardInfo
  },
  data: vm => ({
    loading: false,
    emailValidated: null,
    showDetailFreeTrial: true,
    token: vm.$route.query.token
  }),
  computed: {
    ...mapGetters('auth', ['getUserInfo', 'isUserLoggedIn']),
    inInvitationProcess () {
      const { query } = this.$route
      return Boolean(
        (query.process === 'invitation-caregiver' ||
          query.process === 'invitation-playdate') &&
          (query.email || query.phone) &&
          query.token
      )
    },
    signupProcess () {
      if (
        this.inInvitationProcess &&
        this.$route.query.process === 'invitation-caregiver'
      ) {
        return 'CAREGIVER'
      }
      return 'PARENT'
    },
    signupProcessCaregiver () {
      return this.signupProcess === 'CAREGIVER'
    }
  },

  beforeMount () {
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

    async onSubmit (data) {
      try {
        this.loading = true
        if (!this.isUserLoggedIn) {
          await this.registerProcess(
            this.signupProcessCaregiver ? { data, token: this.token } : data
          )
          this.$snotify.success('Welcome to Playgarden Prep!')
        }
        this.goToStepTwo()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    async registerProcess (data) {
      return await this.newParent(data)
    },
    goToStepTwo () {
      this.$router.push({
        name: 'app-payment',
        query: {
          step: 2,
          process: 'signup'
        }
      })
    }
  }
}
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
</style>
