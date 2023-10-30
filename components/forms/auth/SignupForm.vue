<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form @submit.prevent="passes(onSubmit)">
      <v-container class="px-0">
        <v-row no-gutters>
          <v-col
            :class="{ 'pr-2': $vuetify.breakpoint.mdAndUp }"
            :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
          >
            <!-- First name -->
            <validation-provider
              v-slot="{ errors }"
              name="name"
              rules="required"
            >
              <pg-text-field
                v-model="draft.firstName"
                clearable
                :disabled="loading"
                :error-messages="errors"
                label="Name"
                class="custom-text-field"
                :loading="loading"
                solo
              />
            </validation-provider>
          </v-col>
          <v-col
            :class="{ 'pl-2': $vuetify.breakpoint.mdAndUp }"
            :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
          >
            <!-- Last name -->
            <validation-provider
              v-slot="{ errors }"
              name="lastName"
              rules="required"
            >
              <pg-text-field
                v-model="draft.lastName"
                clearable
                :disabled="loading"
                :error-messages="errors"
                label="Last name"
                class="custom-text-field"
                :loading="loading"
                solo
              />
            </validation-provider>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <!-- Phone number -->
                <validation-provider
                  v-slot="{ errors }"
                  name="phoneNumber"
                  rules="required|min:7|max:20|phone"
                >
                  <pg-text-field
                    v-model="draft.phoneNumber"
                    v-mask="['(###) ###-####']"
                    clearable
                    :disabled="loading || hasInvitationPhone"
                    :error-messages="errors"
                    label="Phone number"
                    class="custom-text-field"
                    :loading="loading"
                    maxlength="20"
                    solo
                  />
                </validation-provider>

                <!-- Email -->
                <validation-provider
                  v-slot="{ errors }"
                  name="email"
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
                    class="custom-text-field"
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
                    :bottom="$vuetify.breakpoint.xs"
                    :right="$vuetify.breakpoint.smAndUp"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <validation-provider
                        v-slot="{ errors }"
                        name="password"
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

                  <!-- Password confirmation -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="password"
                    rules="required|confirmed:password_field"
                  >
                    <pg-password-field
                      v-model="draft.passwordConfirmation"
                      clearable
                      :disabled="loading"
                      :error-messages="errors"
                      label="Confirm password"
                      :loading="loading"
                      maxlength="20"
                      solo
                    />
                  </validation-provider>
                </template>

                <v-btn
                  block
                  min-height="60"
                  class="mb-6 main-btn"
                  color="green2"
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  x-large
                >
                  {{
                    inInvitationProcess || !isUserLoggedIn
                      ? "SIGN UP"
                      : "CONTINUE"
                  }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <p v-if="!inInvitationProcess" class="text-center messages-info-register">
          You will only be billed after your 15-day FREE trial is complete!
        </p>
      </v-container>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapGetters } from 'vuex'

import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'SignupForm',

  props: {
    emailValidated: {
      type: String,
      default: null
    },

    inInvitationProcess: Boolean,

    loading: Boolean,

    userSocialData: {
      type: Object,
      default: undefined
    }
  },

  data: () => ({
    draft: {},
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

  methods: {
    onSubmit () {
      this.$emit(
        'click:submit',
        jsonCopy({
          ...this.draft
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
</style>
