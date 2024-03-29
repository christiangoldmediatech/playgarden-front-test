<template>
  <v-container :class="{ 'mt-n14': !$vuetify.breakpoint.mdAndUp }">
    <v-row
      :class="{ 'mt-n4': !$vuetify.breakpoint.mdAndUp }"
      align="center"
      justify="center"
      no-gutters
      class="py-0 py-md-16"
    >
      <v-col cols="12" md="6">
        <!-- BACK BUTTON -->
        <v-row>
          <v-btn
            class="text-none mt-4 pl-md-n16 go-back"
            color="accent"
            href="https://playgardenonline.com/"
            text
            exact
            :absolute="$vuetify.breakpoint.mdAndUp"
          >
            <v-icon class="mr-2" small left color="accent">
              mdi-less-than
            </v-icon>
            {{ $t('login.backBtnText') }}
          </v-btn>
        </v-row>

        <!-- CHILD IMAGE -->
        <div class="image">
          <v-img
            contain
            alt="Smiling Girl Picture"
            :src="require('@/assets/png/welcome-back.png')"
          />
        </div>
      </v-col>

      <v-col cols="12" md="6" class="px-0 px-md-4">
        <div class="login-form">
          <!-- FORM TITLE -->
          <div class="my-5 text-center mb-md-2 mt-md-0 text-md-left">
            <underlined-title :text="$t('login.title')" />
          </div>

          <!-- FORM LOADING -->
          <v-alert
            v-if="errorMessage"
            border="left"
            color="orange"
            dense
            outlined
            text
            type="warning"
          >
            {{ errorMessage }}
          </v-alert>
          <pg-loading v-if="loadingDataSocial" />

          <!-- LOGIN FORM -->
          <login-form v-else :loading="loading" @click:submit="onSubmit" />

          <!-- or -->
          <v-row no-gutters class="my-6">
            <v-col class="hr-line">
              <v-divider />
            </v-col>

            <v-col class="text-center">
              {{ $t('commonWords.conjunctionText') }}
            </v-col>

            <v-col class="hr-line">
              <v-divider />
            </v-col>
          </v-row>

          <!-- Social buttons -->
          <v-row no-gutters>
            <!-- LIBRARY CARD -->
            <!-- <v-col class="mb-6 mb-md-4" cols="12" order="2" order-md="0">
              <v-btn
                block
                height="45"
                class="social-btn"
                @click="goToLibraryCardValidator"
              >
                <img
                  alt="Facebook"
                  class="mr-1"
                  src="@/assets/svg/library-card-signup.svg"
                />

                <span class="spanSocialNetwork">{{ $t('register.registerForm.registerWithLibraryCard') }}</span>
              </v-btn>
            </v-col> -->

            <!-- FACEBOOK -->
            <v-col class="mb-4 mb-md-0 pr-md-4" cols="12" md="6">
              <v-btn
                block
                height="45"
                class="social-btn"
                @click="facebookSignIn"
              >
                <img
                  alt="Facebook"
                  class="mr-1"
                  src="@/assets/svg/facebook_icon.svg"
                />

                <span class="spanSocialNetwork">{{ $t('login.loginWithFb') }}</span>
              </v-btn>
            </v-col>

            <!-- GOOGLE -->
            <v-col class="mb-4 mb-md-0" cols="12" md="6">
              <v-btn block height="45" class="social-btn" @click="googleSignIn">
                <img
                  alt="Google"
                  class="mr-1"
                  src="@/assets/svg/google_icon.svg"
                />

                <span class="spanSocialNetwork">{{ $t('login.loginWithGoogle') }}</span>
              </v-btn>
            </v-col>

            <!-- LIBRARY CARD -->
            <v-col class="mb-6 mb-md-4 mt-4" cols="12" order="2" order-md="0">
              <v-btn
                block
                height="45"
                class="social-btn text-wrap dynamic-width"
                @click="goToLibraryCardValidator"
              >
                <img
                  alt="Facebook"
                  class="mr-1"
                  src="@/assets/svg/library-card-signup.svg"
                />

                <p class="spanSocialNetwork text-wrap dynamic-width ma-0">
                  {{ $t('register.registerForm.registerWithLibraryCard') }}
                </p>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { UserRole, APP_EVENTS } from '@/models'
import LoginForm from '@/components/forms/auth/LoginForm.vue'

export default {
  name: 'Login',

  components: {
    LoginForm
  },

  data() {
    return {
      loading: false,
      errorMessage: '',
      loadingDataSocial: false
    }
  },

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),
    ...mapGetters('auth', ['isUserLoggedIn', 'hasPlayAndLearnPlan']),
    ...mapGetters(['getCurrentChild']),
    ...mapGetters('children', { children: 'rows' }),
    inInvitationProcess() {
      const { query } = this.$route

      return Boolean(
        query.process === 'invitation-playdate' &&
          (query.email || query.phone) &&
          query.token
      )
    },

    isKidsCornerRedirect() {
      const { query } = this.$route
      return query.kidsCornerRedirect === 'true'
    },

    isPlaygardenAdminRedirect() {
      const { query } = this.$route
      return query.playgardenAdminRedirect === 'true'
    }
  },

  created() {
    if (this.isUserLoggedIn) {
      if (this.getCurrentChild?.length > 0) {
        this.$router.push({ name: 'app-virtual-preschool' })
        return
      } else {
        this.$router.push({ name: 'app-pick-child' })
        return
      }
    }
    this.getDataFirebase()
  },

  mounted() {
    // If already logged in and is redirecting to kids corner, rdirect directly insted of waiting for the login
    if (
      this.isKidsCornerRedirect &&
      this.$store.getters['auth/isUserLoggedIn']
    ) {
      // Go to kids corner
      window.open(
        `${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`,
        '_self'
      )
    }

    if (
      this.isPlaygardenAdminRedirect &&
      this.$store.getters['auth/isUserLoggedIn']
    ) {
      // Go to Playgarden admin
      window.open(
        `${process.env.playgardenAdminUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`,
        '_self'
      )
    }
  },

  beforeDestroy() {
    this.$nuxt.$off(APP_EVENTS.LOGIN_EVENT)
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),
    ...mapActions('children', { getChildren: 'get' }),
    getProviderSignIn(provider) {
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
    async getDataFirebase() {
      this.loadingDataSocial = true;
      const fireAuthObj = this.$fireAuthObj();

      try {
        const result = await fireAuthObj.getRedirectResult();

        if (result) {
          if (result.additionalUserInfo) {
            const profile = { ...result.additionalUserInfo.profile };
            await this.loginWithSocialNetwork({
              firstName: profile.given_name || profile.first_name || '',
              lastName: profile.family_name || profile.last_name || '',
              email: profile.email,
              socialNetwork: this.getProviderSignIn(result.additionalUserInfo.providerId),
              socialNetworkId: profile.id
            });
          } else {
            this.loadingDataSocial = false;
          }
        }
      } catch (error) {
        console.error('Error during redirect result check:', error);
        this.$toast.error(error.message);
      } finally {
        // Sign out to clear any lingering redirect state
        fireAuthObj.signOut();
        this.loadingDataSocial = false;
      }
    },

    facebookSignIn() {
      this.socialSignIn(
        'FACEBOOK',
        new this.$fireAuthObj.FacebookAuthProvider()
      )
    },

    googleSignIn() {
      this.socialSignIn('GOOGLE', new this.$fireAuthObj.GoogleAuthProvider())
    },

    async loginWithSocialNetwork(user) {
      try {
        this.disableAxiosGlobal()
        await this.authLoginSocial(user)
        this.enableAxiosGlobal()
        this.loadingDataSocial = false
        if (this.isKidsCornerRedirect) {
          // Go to kids corner
          window.open(
            `${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`,
            '_self'
          )
        } else if (this.$route.query.redirect) {
          await this.$router.push(
            decodeURIComponent(this.$route.query.redirect)
          )
        } else {
          await this.$router.push(this.goToPage(user))
        }
      } catch (e) {
        this.loadingDataSocial = false
        await this.onFailLoginSocial(user)
      }
    },

    goToPage(user) {
      this.$gtm.push({
        event: APP_EVENTS.LOGIN_EVENT,
        userId_parent: user.id
      })
      if (user.stripeStatus === 'active' && user.registerStep > 3) {
        if (user.planSelected.id === 2 || user.planSelected.id === 3) {
          return { name: 'app-virtual-preschool', query: {} }
        }
        if (user.planSelected.id === 1) {
          return { name: 'app-virtual-preschool', query: {} }
        }
      } else if (user.registerStep >= 3) {
        if (this.children.length === 0) {
          return {
            name: this.hasPlayAndLearnPlan
              ? 'app-play-learn-children'
              : 'app-normal-children',
            query: {
              step: '4',
              process: 'signup'
            }
          }
        }

        return { name: 'app-virtual-preschool', query: {} }
      }

      if (user.registerStep === 2) {
        return {
          name: 'app-normal-payment',
          query: {
            step: '3',
            process: 'signup'
          }
        }
      }
    },

    async onFailLoginSocial(user) {
      try {
        this.validateEmail(user)

        await this.$router.push({
          name: 'auth-parent',
          query: { process: 'social-signup', _u: btoa(JSON.stringify(user)) }
        })
      } catch (e) {
        this.$toast.error('This email is already on used!')
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

    async onSubmit(data) {
      try {
        this.loading = true
        this.errorMessage = ''

        await this.login(data)
        await this.fetchUserInfo()
        await this.getChildren()

        if (this.isKidsCornerRedirect) {
          // Go to kids corner
          window.open(
            `${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`,
            '_self'
          )
        } else if (this.inInvitationProcess) {
          await this.$router.push({
            name: 'app-playdates-join',
            query: this.$route.query
          })
        } else if (this.$route.query.redirect) {
          await this.$router.push(
            decodeURIComponent(this.$route.query.redirect)
          )
        } else if (this.userInfo.role.id === UserRole.SUPER_ADMIN) {
          const atoken = this.$store.getters['auth/getAccessToken']
          window.open(
            `${process.env.playgardenAdminUrl}?atoken=${atoken}`,
            '_self'
          )
        } else {
          await this.$router.push(this.goToPage(this.userInfo))
        }
      } catch (error) {
        this.errorMessage = this.$t('login.wrongPassword')
      } finally {
        this.loading = false
      }
    },

    socialSignIn(nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj.signInWithRedirect(provider)
    },

    goToLibraryCardValidator() {
      this.$router.push({ name: 'auth-preschool-library-card' })
    }
  },
  head: {
    title: 'Playgarden Online Login',
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'description',
        name: 'description',
        content: 'Login to your Playgarden Online account using email, Facebook, or Google. New to PG Online? Sign up FREE for Online Preschool'
      }
    ]
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
  width: 100%;
  height: 100%;
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
.dynamic-width {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  text-align: center;
  max-width: 100%; /* Adjust this value based on your needs */
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
