<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form @submit.prevent="passes(onSubmit)">
      <v-container class="px-0">
        <v-row no-gutters class="some">
          <v-col
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
                </template>

                <v-btn
                  block
                  min-height="60"
                  class="mb-6 main-btn"
                  color="primary"
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  x-large
                >
                  NEXT
                </v-btn>
              </v-col>
            </v-row>

            <!-- or -->
            <v-row no-gutters class="my-6 d-none d-sm-flex">
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
import { mapGetters } from 'vuex'

import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'RegisterForm',

  props: {
    emailValidated: {
      type: String,
      default: null
    },

    inInvitationProcess: Boolean,

    loading: Boolean
  },

  data: vm => ({
    draft: {},
    userSocialData: (() => {
      const { query } = vm.$route
      if (query.process === 'social-signup' && query._u) {
        try {
          return JSON.parse(atob(query._u))
        } catch (e) {}
      }
      return null
    })(),
    show: true
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

  mounted () {
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
        : null
    }
  },

  created () {
    /* this.$nuxt.$on('singup-social-network', (dataUser) => {
      this.draft = { ...dataUser }
      this.userSocialData = true
    }) */
  },

  beforeDestroy () {
    // this.$nuxt.$off('singup-social-network')
  },

  methods: {
    onSubmit () {
      this.$emit(
        'click:submit',
        jsonCopy({
          ...this.draft
        })
      )
    },

    facebookSignIn () {},

    googleSignIn () {}
  }
}
</script>
