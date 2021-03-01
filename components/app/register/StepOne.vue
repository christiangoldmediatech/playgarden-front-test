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
        <v-col cols="12" class="ml-14">
          <underlined-title :class="(!$vuetify.breakpoint.smAndUp) ? 'text-h6 text-md-h4' : 'text-h6 text-md-h4 ml-4'" text="PLAYGARDEN PREP ONLINE IS COMPLETELY FREE!" />
        </v-col>
        <v-col
          class="px-12 mt-1 mt-md-12"
          cols="12"
          sm="12"
          xs="12"
          md="5"
          lg="6"
          xl="6"
        >
          <p class="text-center text-md-left">
            <span class="text-header-info info-color-signup">
              You will only be billed after 30 days of FREE trial is completed
            </span>
          </p>

          <register-form
            :email-validated="emailValidated"
            :in-invitation-process="inInvitationProcess"
            :loading="loading"
            :user-social-data="userSocialData"
            @click:submit="onSubmit"
          />
        </v-col>

        <v-col
          cols="12"
          sm="12"
          xs="12"
          md="8"
          lg="6"
        >
          <template>
            <v-row :class="($vuetify.breakpoint.smAndUp) ? 'mt-4 background-card' : 'background-card-mobile pt-14'">
              <v-col cols="12" :class="(!$vuetify.breakpoint.smAndUp) ? '' : 'mt-10 mb-10 pl-8 pr-8'">
                <v-layout row wrap align-center justify-center>
                  <v-card class="elevation-0">
                    <v-container>
                      <v-layout column align-center justify-center>
                        <v-card-title primary-title>
                          <v-btn
                            block
                            text
                            @click="changeShowDetail"
                          >
                            <img
                              src="@/assets/png/gift-icon.png"
                              class="mr-2"
                              width="18px"
                            >
                            <span class="free-trial-info">
                              GET 30 DAYS OF FREE TRIAL
                            </span>
                            <v-icon v-if="showDetailFreeTrial" class="hidden-md-only hidden-lg-only">
                              mdi-menu-down
                            </v-icon>
                            <v-icon v-else class="hidden-md-only hidden-lg-only">
                              mdi-menu-up
                            </v-icon>
                          </v-btn>
                        </v-card-title>
                        <v-card-text>
                          <div v-if="!showDetailFreeTrial" class="text-mdi-monitor">
                            <center class="text-pay-information">
                              <div>
                                <v-row class="ml-4">
                                  <span class="font-weight-bold">That includes:</span>
                                </v-row>
                                <v-row>
                                  <ul>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        A Daily Learning Schedule
                                      </small>
                                    </li>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        Access to over 1,200 lessons
                                      </small>
                                    </li>
                                    <li
                                      class="register-item text-left"
                                    >
                                      <small class="text-trial">
                                        Live Classes with Playgarden Prep Teachers
                                      </small>
                                    </li>
                                  </ul>
                                </v-row>
                              </div>
                              <v-row justify="center">
                                <v-col cols="3">
                                  <v-btn
                                    block
                                    class="mt-4 info-much-more"
                                  >
                                    <span class="much-info">
                                      AND MUCH MORE!!
                                    </span>
                                  </v-btn>
                                </v-col>
                                <span
                                  class="mt-2 text-header-info"
                                >
                                  *You can cancel you membership any time from the account settings.
                                </span>
                              </v-row>
                            </center>
                          </div>
                        </v-card-text>
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
export default {
  name: 'StepOne',
  components: {
    RegisterForm
  },
  data: vm => ({
    loading: false,
    emailValidated: null,
    showDetailFreeTrial: false,
    userSocialData: (() => {
      const { query } = vm.$route
      if (query.process === 'social-signup' && query._u) {
        try {
          return JSON.parse(atob(query._u))
        } catch (e) {}
      }
      return null
    })(),
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

    changeShowDetail () {
      if (!this.$vuetify.breakpoint.smAndUp) {
        this.showDetailFreeTrial = !this.showDetailFreeTrial
      }
    },

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
        name: 'app-payment-shorter',
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
ul {
  list-style: none; /* Remove default bullets */
}
ul li::before {
  content: "●";
  font-size: 24px !important;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}
.free-trial-info {
  font-size: 18px;
}
.text-trial {
  margin-top: 14px;
  font-size: 14px !important;
  position: absolute;
}
.much-info {
  color: var(--v-accent-base);
}
.text-header-info {
  font-size: 14px !important;
}

.info-much-more {
  background-color: rgba(248, 152, 56, 0.3) !important;
}
</style>
