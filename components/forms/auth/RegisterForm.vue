<template>
  <validation-observer v-slot="{ invalid, passes }">
    <pg-loading v-if="loadingDataSocial" />
    <v-form v-else @submit.prevent="passes(onSubmit)">
      <v-container class="px-0">
        <v-row no-gutters class="some">
          <v-col class="pr-0 pr-sm-2" cols="12" md="6">
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
                :label="$t('register.registerForm.firstName')"
                class="custom-text-field"
                :loading="loading"
                solo-labeled
              />
            </validation-provider>
          </v-col>
          <v-col cols="12" md="6">
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
                :label="$t('register.registerForm.lastName')"
                class="custom-text-field"
                :loading="loading"
                solo-labeled
              />
            </validation-provider>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col v-if="!isAddressRequired" cols="12">
                <!-- Phone number -->
                <validation-provider
                  v-if="isPhoneNumberRequired"
                  v-slot="{ errors }"
                  name="Phone Number (optional)"
                  rules="phone"
                >
                  <pg-text-field
                    v-model="draft.phoneNumber"
                    clearable
                    :disabled="loading"
                    :error-messages="errors"
                    :label="$t('register.registerForm.optionalPhoneNumber')"
                    :loading="loading"
                    class="custom-text-field"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>

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
                    :label="$t('register.registerForm.email')"
                    :loading="loading"
                    solo-labeled
                    class="custom-text-field"
                    type="email"
                  />
                </validation-provider>

                <v-row no-gutters>
                  <v-col v-if="isAddressRequired" class="pr-2" cols="12" md="6">
                    <!-- Address component -->
                    <validation-provider v-slot="{errors}" name="Address" rules="required">
                      <search-address-autocomplete
                        v-model="addressDraft.address1"
                        class="custom-text-field"
                        :errors="errors"
                        @address-components="configureAddress"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col v-if="isAddressRequired" cols="12" md="6">
                    <!-- Phone number -->
                    <validation-provider
                      v-if="isPhoneNumberRequired"
                      v-slot="{ errors }"
                      name="Phone Number (optional)"
                      rules="phone"
                    >
                      <pg-text-field
                        v-model="draft.phoneNumber"
                        clearable
                        :disabled="loading"
                        :error-messages="errors"
                        :label="$t('register.registerForm.optionalPhoneNumber')"
                        class="custom-text-field"
                        :loading="loading"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

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
                        rules="required|min:6|max:20|w_number|w_special|w_upper|w_strong_password"
                        vid="password_field"
                      >
                        <pg-password-field
                          v-model="draft.password"
                          clearable
                          :disabled="loading"
                          :error-messages="errors"
                          :label="$t('register.registerForm.password')"
                          :loading="loading"
                          maxlength="20"
                          solo-labeled
                          class="custom-text-field"
                          v-bind="attrs"
                          v-on="on"
                        />
                      </validation-provider>
                    </template>

                    <span class="white--text">
                      {{ $t('register.registerForm.passwordSuggestion1') }}
                    </span>
                    <br />
                    <span class="white--text">
                      {{ $t('register.registerForm.passwordSuggestion2') }}
                    </span>
                    <br />
                    <span class="white--text">
                      {{ $t('register.registerForm.passwordSuggestion3') }}
                    </span>
                    <br />
                    <span class="white--text">
                      {{ $t('register.registerForm.passwordSuggestion4') }}
                    </span>
                    <br />
                  </v-tooltip>

                  <!-- Coupon -->
                  <validation-provider
                    v-if="!isCreditCardRequired && isCouponNeeded"
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
                      :label="$t('register.registerForm.coupon')"
                      solo-labeled
                      class="custom-text-field"
                      @change="checkCoupon"
                    />
                  </validation-provider>

                  <!-- MESSAGE IF COUPON IS VALID OR NOT -->
                  <div
                    v-if="Boolean(draft.promotion_id) && isValidCoupon !== null"
                    class="mt-n6 mb-4"
                  >
                    <span v-if="isValidCoupon" class="green--text">
                      {{ $t('register.registerForm.validCoupon') }}
                    </span>
                    <span v-else class="error--text">{{ $t('register.registerForm.invalidCoupon') }}</span>
                  </div>
                </template>

                <v-row v-if="!noTerms" no-gutters>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Terms"
                    rules="required"
                  >
                    <v-checkbox
                      v-model="draft.acceptTerms"
                      class="pt-0 mt-0 accept-terms"
                      :error-messages="errors"
                      :true-value="true"
                      :false-value="null"
                    >
                      <template #label>
                        {{ $t('register.registerForm.termsAndConditionsPart1') }}

                        <span
                          class="ml-1 terms-conditions link-text"
                          @click="goToTermsAndConditions"
                        >
                          {{ $t('register.registerForm.termsAndConditionsPart2') }}
                        </span>
                      </template>
                    </v-checkbox>
                  </validation-provider>
                </v-row>

                <v-btn
                  block
                  min-height="60"
                  class="mb-6 main-btn"
                  :class="{ 'white--text': whiteBtn }"
                  color="green2"
                  :disabled="invalid || !isValidCoupon"
                  :loading="loading"
                  type="submit"
                  x-large
                >
                  {{ btnText }}
                </v-btn>
                <v-btn
                  block
                  min-height="60"
                  class="mb-6 main-btn"
                  :class="{ 'white--text': whiteBtn }"
                  color="green2"
                  :loading="loading"
                  @click="onSubmit"
                  x-large
                >
                  {{ btnText }}
                </v-btn>
              </v-col>
            </v-row>

            <!-- or -->
            <template v-if="hasValidLibraryCard">
              <v-row no-gutters class="pg-mt-3 pg-mb-6">
                <v-col cols="12">
                  <ui-msg
                    class="pg-text-center"
                    :message="`${$t('register.libraryCard.notice')}`"
                  />
                </v-col>
              </v-row>
            </template>
            <template v-if="!hasValidLibraryCard">
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
                    <span class="spanSocialNetwork">{{ $t('register.registerForm.registerWithFb') }}</span>
                  </v-btn>
                </v-col>

                <!-- GOOGLE -->
                <v-col class="mb-4 mb-md-0 pl-md-4" cols="12" md="6">
                  <v-btn
                    block
                    height="45"
                    class="social-btn"
                    @click="googleSignIn"
                  >
                    <img
                      alt="Google"
                      class="mr-1"
                      src="@/assets/svg/google_icon.svg"
                    />

                    <span class="spanSocialNetwork">{{ $t('register.registerForm.registerWithGoogle') }}</span>
                  </v-btn>
                </v-col>

                <!-- LIBRARY CARD -->
                <v-col class="mb-6 mb-md-4 mt-4" cols="12" order="2" order-md="0">
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
                </v-col>
              </v-row>
            </template>
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
import SearchAddressAutocomplete from '@/components/SearchAddressAutocomplete.vue'
import UiMsg from '~/components/ui/lang/UiMsg.vue'

export default {
  name: 'RegisterForm',

  components: {
    SearchAddressAutocomplete,
    UiMsg
  },

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
    },

    isAddressRequired: {
      type: Boolean,
      default: false
    },

    isPhoneNumberRequired: {
      type: Boolean,
      default: true
    },

    btnText: {
      type: String,
      default: 'START LEARNING'
    },

    whiteBtn: {
      type: Boolean,
      default: false
    },

    isCouponNeeded: {
      type: Boolean,
      default: true
    },

    noTerms: {
      type: Boolean,
      default: true
    }
  },

  data: (vm) => ({
    draft: {},
    addressDraft: {
      address1: null
    },
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
    ...mapGetters('auth/signup', ['hasValidLibraryCard']),

    hasInvitationEmail() {
      return Boolean(
        (this.inInvitationProcess && this.$route.query.email) ||
          this.isUserLoggedIn
      )
    },

    hasInvitationPhone() {
      return Boolean(this.inInvitationProcess && this.$route.query.phone)
    },
    hasUserSocialData() {
      return Boolean(this.userSocialData)
    }
  },

  watch: {
    'draft.promotion_id': {
      immediate: true,
      handler(val) {
        this.isValidCoupon = null

        if (typeof val === 'string') {
          this.draft.promotion_id = val.toUpperCase().trim()
        }

        this.checkCoupon()
      }
    }
  },

  created() {
    this.getDataFirebase()
  },

  mounted() {
    this.setDraft()
  },

  methods: {
    ...mapActions('coupons', ['getCoupons']),

    configureAddress(data) {
      try {
        // eslint-disable-next-line camelcase
        if (data && data.address_components) {
          this.addressDraft = { address1: this.addressDraft.address1 }

          // eslint-disable-next-line camelcase
          const addressComponents = data.address_components

          const city = addressComponents.find(({ types }) =>
            types.includes('locality')
          )
          if (city) {
            this.addressDraft.city = city.long_name
          }

          const state = addressComponents.find(({ types }) =>
            types.includes('administrative_area_level_1')
          )
          if (state) {
            this.addressDraft.state = state.long_name
          }

          if (!city) {
            this.addressDraft.city = 'Not found'
          }

          const country = addressComponents.find(({ types }) =>
            types.includes('country')
          )
          if (country) {
            this.addressDraft.country = country.short_name.toUpperCase()
          }

          const postalCode = addressComponents.find(({ types }) =>
            types.includes('postal_code')
          )
          if (postalCode) {
            this.addressDraft.zipCode = postalCode.short_name.toUpperCase()
          } else {
            this.addressDraft.zipCode = 'Not available'
          }
        }
      } catch {}
    },

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
    getDataFirebase() {
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
                socialNetwork: this.getProviderSignIn(
                  result.additionalUserInfo.providerId
                ),
                socialNetworkId: profile.id
              })
            }
          }
        })
        .catch((e) => {
          this.$toast.error(e.message)
        })
        .finally(() => {
          fireAuthObj.signOut()
          this.loadingDataSocial = false
        })
    },
    setDraft() {
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
        promotion_id: null,
        acceptTerms: null
      }
    },
    onSubmit() {
      const data = jsonCopy(this.draft)
      if (this.addressDraft.address1) {
        data.address = jsonCopy(this.addressDraft)
      }
      this.$emit('click:submit', data)
    },

    goToTermsAndConditions() {
      window.open('https://playgardenonline.com/terms-of-use/', '_blank')
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
        this.loadingDataSocial = true
        this.disableAxiosGlobal()
        await this.authLoginSocial(user)
        this.enableAxiosGlobal()
        await this.$router.push({ name: 'app-virtual-preschool' })
      } catch (e) {
        this.onFailLoginSocial(user)
      }
    },

    onFailLoginSocial(user) {
      try {
        this.validateEmail(user)
        this.userSocialData = { ...user }
        this.setDraft()
      } catch (e) {
        this.$toast.error('This email is already on used!')
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

    socialSignIn(nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj.signInWithRedirect(provider)
    },

    async goToLibraryCardValidator() {
      await this.$router.push({ name: 'auth-preschool-library-card' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.green2 {
  color: var(--v-black-base);
  &:hover {
    color: rgba(#000000, 0.8);
  }
}

.accept-terms ::v-deep .v-label {
  color: var(--v-black-base) !important;
  opacity: 2.49 !important;
}

.terms-conditions {
  text-decoration: underline !important;
  color: var(--v-black-base);
  font-weight: 400;
  cursor: pointer;
}

.v-tooltip__content {
  background-color: var(--v-accent-base) !important;
  color: white !important;
  font-weight: bold !important;
  border-radius: 6px !important;
  z-index: 2 !important;
}

.v-tooltip__content::after {
  content: '';
  position: absolute;
  top: 30%;
  left: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent var(--v-accent-base) transparent transparent;
}
</style>
