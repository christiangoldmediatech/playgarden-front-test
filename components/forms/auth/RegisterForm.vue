<template>
  <validation-observer v-slot="{ invalid, passes }">
    <pg-loading v-if="loadingDataSocial" />
    <v-form v-else @submit.prevent="passes(onSubmit)">
      <v-container class="px-0">
        <v-row no-gutters class="some">
          <v-col
            class="pr-2"
            cols="6"
          >
            <!-- First name -->
            <validation-provider
              v-slot="{ errors }"
              name="Name"
              rules="required"
            >
              <pg-text-field
                v-model="draft.firstName"
                clearable
                :disabled="loading"
                :error-messages="errors"
                label="Name"
                :loading="loading"
                solo
              />
            </validation-provider>
          </v-col>
          <v-col
            cols="6"
          >
            <!-- Last name -->
            <validation-provider
              v-slot="{ errors }"
              name="Last Name"
              rules="required"
            >
              <pg-text-field
                v-model="draft.lastName"
                clearable
                :disabled="loading"
                :error-messages="errors"
                label="Last name"
                :loading="loading"
                solo
              />
            </validation-provider>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <!-- Email -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <pg-text-field
                    v-model="draft.email"
                    clearable
                    :disabled="
                      loading || hasInvitationEmail || hasUserSocialData
                    "
                    :error-messages="errors"
                    label="Email"
                    :loading="loading"
                    solo
                    type="email"
                  />
                </validation-provider>

                <template
                  v-if="
                    (inInvitationProcess || !isUserLoggedIn) && !userSocialData
                  "
                >
                  <!-- Password -->
                  <v-tooltip
                    :top="$vuetify.breakpoint.xs"
                    :right="$vuetify.breakpoint.smAndUp"
                    class="flow-lessons"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Password"
                        rules="required|min:6|max:20|w_number|w_special|w_upper"
                        vid="password_field"
                      >
                        <pg-password-field
                          v-model="draft.password"
                          clearable
                          :disabled="loading"
                          :error-messages="errors"
                          label="Password"
                          :loading="loading"
                          maxlength="20"
                          solo
                          v-bind="attrs"
                          v-on="on"
                        />
                      </validation-provider>
                    </template>

                    <span class="white--text">
                      At least 6 characters—the more characters, the better.
                    </span>
                    <br>
                    <span class="white--text">
                      A mixture of both uppercase and lowercase letters.
                    </span>
                    <br>
                    <span class="white--text">
                      A mixture of letters and numbers.
                    </span>
                    <br>
                    <span class="white--text">
                      Inclusion of at least one special character, e.g., !@#?]
                    </span>
                    <br>
                  </v-tooltip>

                  <!-- Coupon -->
                  <validation-provider
                    v-if="!isCreditCardRequired"
                    v-slot="{ errors }"
                    name="Coupon"
                    vid="coupon_field"
                  >
                    <pg-text-field
                      v-model="draft.promotion_id"
                      :disabled="loading"
                      :error-messages="errors"
                      :loading="isCheckingCoupon"
                      clearable
                      label="Coupon"
                      solo
                      @change="checkCoupon"
                    />
                  </validation-provider>

                  <!-- MESSAGE IF COUPON IS VALID OR NOT -->
                  <div v-if="Boolean(draft.promotion_id) && isValidCoupon !== null" class="mt-n6 mb-4">
                    <span v-if="isValidCoupon" class="green--text">Valid coupon!</span>
                    <span v-else class="error--text">Invalid coupon!</span>
                  </div>
                </template>

                <v-btn
                  block
                  min-height="60"
                  class="mb-6 main-btn"
                  color="green2"
                  :disabled="invalid || !isValidCoupon"
                  :loading="loading"
                  type="submit"
                  x-large
                >
                  NEXT
                </v-btn>
              </v-col>
            </v-row>

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
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import debounce from 'lodash/debounce'

import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'RegisterForm',

  props: {
    emailValidated: {
      type: String,
      default: null
    },

    inInvitationProcess: Boolean,

    loading: Boolean,

    isCreditCardRequired: {
      type: Boolean,
      default: false
    }
  },

  data: vm => ({
    draft: {},
    loadingDataSocial: false,
    userSocialData: (() => {
      const { query } = vm.$route
      if (query.process === 'social-signup' && query._u) {
        try {
          return JSON.parse(atob(query._u))
        } catch (e) {}
      }
      return null
    })(),
    show: true,
    checkCoupon: debounce(vm._checkCoupon, 750),
    isValidCoupon: null,
    isCheckingCoupon: false
  }),

  computed: {
    ...mapGetters('auth', ['getUserInfo', 'isUserLoggedIn']),

    hasInvitationEmail () {
      return Boolean(
        (this.inInvitationProcess && this.$route.query.email) ||
          this.isUserLoggedIn
      )
    },

    hasInvitationPhone () {
      return Boolean(this.inInvitationProcess && this.$route.query.phone)
    },
    hasUserSocialData () {
      return Boolean(this.userSocialData)
    }
  },

  watch: {
    'draft.promotion_id': {
      immediate: true,
      handler (val) {
        this.isValidCoupon = null

        if (typeof val === 'string') {
          this.draft.promotion_id = val.toUpperCase().trim()
        }

        this.checkCoupon()
      }
    }
  },

  created () {
    this.getDataFirebase()
  },

  mounted () {
    this.setDraft()
  },

  methods: {
    ...mapActions('coupons', ['getCoupons']),

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
            }
          }
        })
        .catch((e) => {
          this.$snotify.error(e.message)
        })
        .finally(() => {
          fireAuthObj.signOut()
          this.loadingDataSocial = false
        })
    },
    setDraft () {
      this.draft = {
        firstName: this.hasUserSocialData
          ? this.userSocialData.firstName
          : this.getUserInfo.firstName || null,
        lastName: this.hasUserSocialData
          ? this.userSocialData.lastName
          : this.getUserInfo.lastName || null,
        phoneNumber:
          this.$route.query.phone || this.getUserInfo.phoneNumber || null,
        email: this.hasUserSocialData
          ? this.userSocialData.email
          : this.$route.query.email ||
            this.getUserInfo.email ||
            this.emailValidated ||
            null,
        password: null,
        passwordConfirmation: null,
        socialNetwork: this.hasUserSocialData
          ? this.userSocialData.socialNetwork
          : null,
        socialNetworkId: this.hasUserSocialData
          ? this.userSocialData.socialNetworkId
          : null,
        promotion_id: null
      }
    },
    onSubmit () {
      this.$emit(
        'click:submit',
        jsonCopy({
          ...this.draft
        })
      )
    },

    async _checkCoupon() {
      try {
        this.isCheckingCoupon = true
        // Coupon is not requested for CREDITCARD flow.
        if (this.isCreditCardRequired || !this.draft.promotion_id) {
          this.isValidCoupon = true
          return true
        }

        // Only check for coupon validity if it is NO CREDITCARD flow.
        const coupons = await this.getCoupons({
          active: true,
          code: this.draft.promotion_id
        })

        if (coupons?.length > 0) {
          this.isValidCoupon = true
          return true
        } else {
          this.isValidCoupon = false
          return false
        }
      } catch (error) {
        return false
      } finally {
        this.isCheckingCoupon = false
      }
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
        this.loadingDataSocial = true
        this.disableAxiosGlobal()
        await this.authLoginSocial(user)
        this.enableAxiosGlobal()
        await this.$router.push({ name: 'app-virtual-preschool' })
      } catch (e) {
        this.onFailLoginSocial(user)
      }
    },

    onFailLoginSocial (user) {
      try {
        this.validateEmail(user)
        this.userSocialData = { ...user }
        this.setDraft()
      } catch (e) {
        this.$snotify.error('This email is already on used!')
      } finally {
        this.enableAxiosGlobal()
        this.loadingDataSocial = false
      }
    },
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('auth/login', ['login']),

    ...mapActions('auth/signup', {
      validateEmail: 'signupEmail'
    }),

    ...mapActions('auth/socialUser', ['authLoginSocial']),

    socialSignIn (nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj.signInWithRedirect(provider)
    }
  }
}
</script>

<style lang="scss" scoped>
.green2{
  color:var(--v-black-base);
  &:hover{
    color:rgba(#000000,0.8);
  }
}
</style>
