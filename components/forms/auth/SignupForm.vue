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
              name="Name"
              rules="required"
            >
              <v-text-field
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
            :class="{ 'pl-2': $vuetify.breakpoint.mdAndUp }"
            :cols="$vuetify.breakpoint.mdAndUp ? '6' : '12'"
          >
            <!-- Last name -->
            <validation-provider
              v-slot="{ errors }"
              name="Last Name"
              rules="required"
            >
              <v-text-field
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
                <!-- Phone number -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Phone number"
                  rules="required|min:7|max:20|phone"
                >
                  <v-text-field
                    v-model="draft.phoneNumber"
                    v-mask="['(###) ###-####']"
                    clearable
                    :disabled="loading || hasInvitationPhone"
                    :error-messages="errors"
                    label="Phone number"
                    :loading="loading"
                    maxlength="20"
                    solo
                  />
                </validation-provider>

                <!-- Email -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="draft.email"
                    clearable
                    :disabled="loading || hasInvitationEmail"
                    :error-messages="errors"
                    label="Email"
                    :loading="loading"
                    solo
                    type="email"
                  />
                </validation-provider>

                <template v-if="inInvitationProcess || !isUserLoggedIn">
                  <!-- Password -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required|min:8|max:20|w_number|w_special|w_upper|confirmed:passwordConfirmation"
                  >
                    <password-field
                      v-model="draft.password"
                      clearable
                      :disabled="loading"
                      :error-messages="errors"
                      label="Password"
                      :loading="loading"
                      maxlength="20"
                      solo
                    />
                  </validation-provider>

                  <!-- Password confirmation -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="Confirm password"
                    rules="required"
                    vid="passwordConfirmation"
                  >
                    <password-field
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
                  class="mb-6 main-btn"
                  color="primary"
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  x-large
                >
                  {{
                    inInvitationProcess || !isUserLoggedIn
                      ? "SIGNUP"
                      : "CONTINUE"
                  }}
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
  name: 'SignupForm',

  props: {
    emailValidated: {
      type: String,
      default: null
    },

    inInvitationProcess: Boolean,

    loading: Boolean
  },

  data: () => ({
    draft: {}
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
    }
  },

  mounted () {
    this.draft = {
      firstName: this.getUserInfo.firstName || null,
      lastName: this.getUserInfo.lastName || null,
      phoneNumber:
        this.$route.query.phone || this.getUserInfo.phoneNumber || null,
      email:
        this.$route.query.email ||
        this.getUserInfo.email ||
        this.emailValidated ||
        null,
      password: null,
      passwordConfirmation: null
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
