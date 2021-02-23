<template>
  <v-row align="center" justify="center" no-gutters class="py-0 py-md-16">
    <v-col cols="11" md="6">
      <v-row>
        <v-btn
          class="text-none mt-n10 pl-md-n16 go-back"
          color="accent"
          href="https://playgardenonline.com/"
          text
          exact
          :absolute="$vuetify.breakpoint.mdAndUp"
        >
          <v-icon class="mr-2" small left color="accent">
            mdi-less-than
          </v-icon>
          Go Back To Homepage
        </v-btn>
      </v-row>
      <div
        class="image mt-14 mt-md-0"
        :class="{ mobile: $vuetify.breakpoint.smAndDown }"
      >
        <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 mb-md-2 mt-md-0 text-center text-md-left">
          <underlined-title text="Welcome back!" />
        </div>

        <login-form :loading="loading" @click:submit="onSubmit" />

        <!-- or -->
        <v-row no-gutters class="my-6">
          <v-col class="hr-line">
            <v-divider />
          </v-col>

          <v-col class="text-center">
            or
          </v-col>

          <v-col class="hr-line">
            <v-divider />
          </v-col>
        </v-row>

        <!-- Social buttons -->
        <v-row no-gutters>
          <!-- FACEBOOK -->
          <v-col class="mb-4 mb-md-0 pr-md-4" cols="12" md="6">
            <v-btn block height="45" class="social-btn" @click="facebookSignIn">
              <img
                alt="Facebook"
                class="mr-1"
                src="@/assets/svg/facebook_icon.svg"
              >

              <span class="spanSocialNetwork">Login with Facebook</span>
            </v-btn>
          </v-col>

          <!-- GOOGLE -->
          <v-col class="mb-6 mb-md-0 pl-md-4" cols="12" md="6">
            <v-btn block height="45" class="social-btn" @click="googleSignIn">
              <img
                alt="Google"
                class="mr-1"
                src="@/assets/svg/google_icon.svg"
              >

              <span class="spanSocialNetwork">Login with Google</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import LoginForm from '@/components/forms/auth/LoginForm'

export default {
  name: 'Login',

  components: {
    LoginForm
  },

  data () {
    return {
      loading: false,
      errorMessage: ''
    }
  },

  computed: {
    inInvitationProcess () {
      const { query } = this.$route

      return Boolean(
        query.process === 'invitation-playdate' &&
          (query.email || query.phone) &&
          query.token
      )
    }
  },

  methods: {
    facebookSignIn () {
      this.socialSignIn(
        'FACEBOOK',
        new this.$fireAuthObj.FacebookAuthProvider()
      )
    },

    googleSignIn () {
      this.socialSignIn('GOOGLE', new this.$fireAuthObj.GoogleAuthProvider())
    },

    async loginWithSocialNetwork (user) {
      try {
        this.disableAxiosGlobal()

        await this.authLoginSocial(user)

        this.enableAxiosGlobal()

        await this.$router.push({ name: 'app-dashboard' })
      } catch (e) {
        await this.onFailLoginSocial(user)
      }
    },

    async onFailLoginSocial (user) {
      try {
        this.validateEmail(user)

        await this.$router.push({
          name: 'auth-signup',
          query: { process: 'social-signup', _u: btoa(JSON.stringify(user)) }
        })
      } catch (e) {
        this.$snotify.error('This email is already on used!')
      } finally {
        this.enableAxiosGlobal()
      }
    },
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('auth/login', ['login']),

    ...mapActions('auth/signup', {
      validateEmail: 'signupEmail'
    }),

    ...mapActions('auth/socialUser', ['authLoginSocial']),

    async onSubmit (data) {
      try {
        this.loading = true
        this.errorMessage = ''

        await this.login(data)

        if (this.inInvitationProcess) {
          await this.$router.push({
            name: 'app-playdates-join',
            query: this.$route.query
          })
        } else {
          await this.$router.push({ name: 'app-dashboard' })
        }
      } catch (error) {
        this.errorMessage = 'Sorry! Wrong email or password'
      } finally {
        this.loading = false
      }
    },

    socialSignIn (nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()

      fireAuthObj
        .signInWithPopup(provider)
        .then((result) => {
          const profile = { ...result.additionalUserInfo.profile }

          this.loginWithSocialNetwork({
            firstName: profile.given_name || profile.first_name || '',
            lastName: profile.family_name || profile.last_name || '',
            email: profile.email,
            socialNetwork: nameSocialNetwork,
            socialNetworkId: profile.id
          })
        })
        .catch((e) => {
          this.$snotify.error(e.message)
        })
        .finally(() => fireAuthObj.signOut())
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
.hr-line {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  max-width: 500px;
}
.error-message {
  color: var(--v-error-base);
}
.go-back {
  top: 60px;
  left: 10px;
}
</style>
