<template>
  <v-row
    v-if="
      emailValidated || inInvitationProcess || isUserLoggedIn || userSocialData
    "
    no-gutters
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
              PARENT INFORMATION
            </span>
          </p>

          <signup-form
            :email-validated="emailValidated"
            :in-invitation-process="inInvitationProcess"
            :loading="loading"
            :user-social-data="userSocialData"
            @click:submit="onSubmit"
          />
        </v-col>

        <v-col class="px-12" cols="12" md="4">
          <p
            class="font-weight-bold text-h5 pg-letter-spacing text-center text-md-left"
          >
            MEMBERSHIP
          </p>

          <p class="mt-6 text-center text-md-left">
            <small>
              Complete the registration and choose the plan that best suits you,
              to start your learning experience!
            </small>
          </p>

          <template v-if="!inInvitationProcess">
            <p class="text-center text-md-left">
              <span class="font-weight-bold">
                Get one week FREE trial
              </span>
            </p>

            <p class="text-center text-md-left">
              <small>You can cancel at any time from your account settings</small>
            </p>
          </template>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-row v-else align="center" justify="center" no-gutters>
    <v-col cols="11" md="6">
      <div class="image">
        <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
          <underlined-title text="Sign Up now!" />
        </div>

        <p>
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

    inInvitationProcess: (() => {
      const { query } = vm.$route

      return Boolean(
        query.process === 'invitation' &&
          (query.email || query.phone) &&
          query.token
      )
    })(),

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

  computed: mapGetters('auth', ['getUserInfo', 'isUserLoggedIn']),

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

    async onSubmit (data) {
      try {
        this.loading = true

        await this.registerProcess(
          this.inInvitationProcess ? { data, token: this.token } : data
        )

        if (this.inInvitationProcess) {
          await this.$router.push({ name: 'app-dashboard' })
        } else if (this.isUserLoggedIn) {
          await this.$router.push({
            name: 'app-children-register',
            query: { process: 'signup', step: '2' }
          })
        } else {
          this.emailValidated = data.email
        }

        if (!this.emailValidated) {
          this.$snotify.success('Welcome to Playgarden Prep!')
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

      return this.inInvitationProcess
        ? await this.newCaregiver(data)
        : await this.validateEmail(data)
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
}
.form {
  max-width: 500px;
}
</style>
