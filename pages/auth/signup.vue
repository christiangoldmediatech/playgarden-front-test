<template>
  <v-row
    v-if="
      emailValidated || inInvitationProcess || isUserLoggedIn || userSocialData
    "
    no-gutters
    class="py-0 py-md-16"
  >
    <v-col>
      <v-row no-gutters>
        <v-btn
          v-if="emailValidated && !isUserLoggedIn"
          color="accent"
          nuxt
          text
          :to="{ name: 'auth-login' }"
        >
          <v-icon left>
            mdi-less-than
          </v-icon>

          Back
        </v-btn>
      </v-row>

      <v-row
        class="flex-column-reverse flex-md-row"
        justify="center"
        no-gutters
      >
        <v-col class="px-12" cols="12" md="8">
          <p class="text-center text-md-left">
            <span class="font-weight-bold text-h5 pg-letter-spacing">
              {{ signupProcess }} INFORMATION
            </span>
          </p>
          <p v-if="inInvitationProcess" class="my-2 text-center text-md-left">
            <small>
              Complete the registration form with your personal information to become a Caregiver!
            </small>
          </p>
          <signup-form
            :email-validated="emailValidated"
            :in-invitation-process="inInvitationProcess"
            :loading="loading"
            :user-social-data="userSocialData"
            @click:submit="onSubmit"
          />
        </v-col>

        <v-col v-if="!inInvitationProcess" class="px-12" cols="12" md="4">
          <p class="mt-6 mb-12 text-center text-md-left">
            <small>
              Complete the registration and choose the plan that best suits your family's needs!
            </small>
          </p>

          <template>
            <p class="text-center text-md-left mt-6">
              <v-row no-gutters>
                <v-col>
                  <img
                    src="@/assets/png/gift-icon.png"
                    class="clickable mr-2"
                    width="18px"
                  >

                  <span
                    class="font-weight-bold text-uppercase pg-letter-spacing-subtitle"
                  >
                    GET 15 DAYS OF FREE TRIAL
                  </span>
                  <v-row no-gutters>
                    <span class="font-weight-bold mt-3">That includes:</span>
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
                </v-col>
              </v-row>
            </p>

            <p v-if="!inInvitationProcess" class="text-center text-md-left mt-10">
              <small>*You can cancel your membership any time from the account
                settings.</small>
            </p>
          </template>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-row v-else align="center" justify="center" no-gutters>
    <v-col cols="11" md="6">
      <div
        class="image mt-4"
        :class="{ mobile: $vuetify.breakpoint.smAndDown }"
      >
        <img alt="Smiling Girl Picture" src="@/assets/png/welcome-back.png">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
          <underlined-title text="Sign Up now!" />
        </div>

        <p class="mt-3">
          Ready to start learning at home? Enter your email to create your
          account and start your membership today.
        </p>

        <signup-email-form :loading="loading" @click:submit="onSubmit" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SignupEmailForm from '@/components/forms/auth/SignupEmailForm'
import SignupForm from '@/components/forms/auth/SignupForm'

export default {
  name: 'Signup',

  components: {
    SignupEmailForm,
    SignupForm
  },

  data: vm => ({
    loading: false,
    emailValidated: null,

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

    async onSubmit (data) {
      try {
        this.loading = true

        await this.registerProcess(
          this.signupProcessCaregiver ? { data, token: this.token } : data
        )

        if (this.signupProcessCaregiver) {
          await this.$router.push({
            name: 'app-virtual-preschool'
          })
        } else if (this.isUserLoggedIn || this.inInvitationProcess) {
          if (this.inInvitationProcess) {
            this.setPlaydateInvitationToken(this.token)
          }

          await this.$router.push({
            name: 'app-children-register',
            query: { process: 'signup', step: '2' }
          })
        } else {
          this.emailValidated = data.email
        }

        if (!this.emailValidated) {
          this.$toast.success('Welcome to Playgarden Prep!')
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async registerProcess (data) {
      if (this.isUserLoggedIn) {
        return await this.updateParentRegister(data)
      }

      if (this.emailValidated) {
        return await this.newParent(data)
      }

      if (this.inInvitationProcess && this.signupProcessCaregiver) {
        return await this.newCaregiver(data)
      } else if (this.inInvitationProcess) {
        return await this.newParent(data)
      }

      return await this.validateEmail(data)
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
  font-size: 28px;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
}

.text-trial {
  margin-top: 11px;
  position: absolute;
}
</style>
