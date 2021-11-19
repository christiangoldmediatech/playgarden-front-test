<template>
  <v-container>
    <v-row align="center" justify="center" no-gutters class="py-0 py-md-16">
      <v-col cols="12" md="6">
        <!-- BACK BUTTON -->
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

        <!-- CHILD IMAGE -->
        <div
          class="image"
        >
          <v-img contain alt="Smiling Girl Picture" :src="require('@/assets/png/welcome-back.png')" />
        </div>
      </v-col>

      <v-col cols="12" md="6" class="px-0 px-md-4">
        <div class="login-form">
          <!-- FORM TITLE -->
          <div class="my-5 mb-md-2 mt-md-0 text-center text-md-left">
            <underlined-title text="Welcome back!" />
          </div>

          <!-- FORM LOADING -->
          <pg-loading v-if="loadingDataSocial" />

          <!-- LOGIN FORM -->
          <login-form v-else :loading="loading" @click:submit="onSubmit" />

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
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import LoginForm from '@/components/forms/auth/LoginForm.vue'

export default {
  name: 'Login',

  components: {
    LoginForm
  },

  data () {
    return {
      loading: false,
      errorMessage: '',
      loadingDataSocial: false
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
    },

    isKidsCornerRedirect () {
      const { query } = this.$route

      return query.kidsCornerRedirect === 'true'
    }
  },

  created () {
    this.getDataFirebase()
  },

  mounted() {
    // If already logged in and is redirecting to kids corner, rdirect directly insted of waiting for the login
    if (this.isKidsCornerRedirect && this.$store.getters['auth/isUserLoggedIn']) {
      // Go to kids corner
      window.open(`${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`, '_self')
    }
  },

  methods: {
    getProviderSignIn (provider) {
      let nameProvider = ''
      switch (provider) {
        case 'google.com':
          nameProvider = 'GOOGLE'
          break
        case 'facebook.com':
          nameProvider = 'FACEBOOK'
          break
      }
      return nameProvider
    },
    getDataFirebase () {
      this.loadingDataSocial = true
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj
        .getRedirectResult()
        .then((result) => {
          if (result) {
            if (result.additionalUserInfo) {
              const profile = { ...result.additionalUserInfo.profile }
              this.loginWithSocialNetwork({
                firstName: profile.given_name || profile.first_name || '',
                lastName: profile.family_name || profile.last_name || '',
                email: profile.email,
                socialNetwork: this.getProviderSignIn(result.additionalUserInfo.providerId),
                socialNetworkId: profile.id
              })
            } else {
              this.loadingDataSocial = false
            }
          }
        })
        .catch((e) => {
          this.loadingDataSocial = false
        })
        .finally(() => fireAuthObj.signOut())
    },
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
        this.loadingDataSocial = false
        if (this.isKidsCornerRedirect) {
          // Go to kids corner
          window.open(`${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`, '_self')
        } else if (this.$route.query.redirect) {
          await this.$router.push(decodeURIComponent(this.$route.query.redirect))
        } else {
          await this.$router.push({ name: 'app-virtual-preschool' })
        }
      } catch (e) {
        this.loadingDataSocial = false
        await this.onFailLoginSocial(user)
      }
    },

    async onFailLoginSocial (user) {
      try {
        this.validateEmail(user)

        await this.$router.push({
          name: 'auth-parent',
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

        if (this.isKidsCornerRedirect) {
          // Go to kids corner
          window.open(`${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`, '_self')
        } else if (this.inInvitationProcess) {
          await this.$router.push({
            name: 'app-playdates-join',
            query: this.$route.query
          })
        } else if (this.$route.query.redirect) {
          await this.$router.push(decodeURIComponent(this.$route.query.redirect))
        } else {
          await this.$router.push({ name: 'app-virtual-preschool' })
        }
      } catch (error) {
        this.errorMessage = 'Sorry! Wrong email or password'
      } finally {
        this.loading = false
      }
    },

    socialSignIn (nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj.signInWithRedirect(provider)
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  margin-top: 48px;
  max-height: 500px;
  display: flex;
  justify-content: center;
  align-content: center;
}
.hr-line {
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  margin: auto;
  max-width: 500px;
}
.error-message {
  color: var(--v-error-base);
}
.go-back {
  top: 60px;
  left: 10px;
}

@media (max-width: $breakpoint-md) {
  .image {
    margin-top: 80px;
  }
}
@media (max-width: $breakpoint-sm) {
  .image {
    max-height: 250px;
  }
}
</style>
