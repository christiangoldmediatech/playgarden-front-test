<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form @submit.prevent="passes(onSubmit)">
      <v-container row class="lighten-5">
        <v-row
          no-gutters
        >
          <v-col
            class="margin-col"
          >
            <!-- First name -->
            <validation-provider
              v-slot="{ errors }"
              name="First name"
              rules="required"
            >
              <v-text-field
                v-model="user.firstName"
                clearable
                :disabled="loading"
                :error-messages="errors"
                label="First name"
                :loading="loading"
                solo
              />
            </validation-provider>
          </v-col>
          <v-col>
            <!-- Last name -->
            <validation-provider
              v-slot="{ errors }"
              name="Last name"
              rules="required"
            >
              <v-text-field
                v-model="user.lastName"
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
            <v-row>
              <v-col cols="12">
                <!-- Phone number -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Phone number"
                  rules="required|min:7|max:20|phone"
                >
                  <v-text-field
                    v-model="user.phoneNumber"
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
                    v-model="user.email"
                    clearable
                    :disabled="loading || hasInvitationEmail"
                    :error-messages="errors"
                    label="Email"
                    :loading="loading"
                    solo
                    type="email"
                  />
                </validation-provider>
                <!-- Password -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Password"
                  rules="required|min:8|max:20|w_number|w_special|w_upper|confirmed:passwordConfirmation"
                >
                  <password-field
                    v-model="user.password"
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
                  name="Password confirmation"
                  rules="required"
                  vid="passwordConfirmation"
                >
                  <password-field
                    v-model="user.passwordConfirmation"
                    clearable
                    :disabled="loading"
                    :error-messages="errors"
                    label="Password confirmation"
                    :loading="loading"
                    maxlength="20"
                    solo
                  />
                </validation-provider>
                <v-btn
                  block
                  class="mb-6"
                  color="primary"
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  x-large
                >
                  SIGNUP
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
import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'SignupForm',

  props: {
    inInvitationProcess: Boolean,

    loading: Boolean
  },

  data: vm => ({
    hasInvitationEmail: (() => {
      return Boolean(vm.inInvitationProcess && vm.$route.query.email)
    })(),

    hasInvitationPhone: (() => {
      return Boolean(vm.inInvitationProcess && vm.$route.query.phone)
    })(),

    user: {
      firstName: '',
      lastName: '',
      phoneNumber: vm.$route.query.phone || '',
      email: vm.$route.query.email || '',
      password: '',
      passwordConfirmation: ''
    }
  }),

  methods: {
    onSubmit () {
      this.$emit(
        'click:submit',
        jsonCopy({
          ...this.user
        })
      )
    }
  }
}
</script>

<style>
.margin-col{
  margin-right: 15px;
}
</style>
