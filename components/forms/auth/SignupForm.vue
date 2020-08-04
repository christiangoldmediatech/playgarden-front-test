<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form @submit.prevent="passes(onSubmit)">
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

      <!-- Phone number -->
      <validation-provider
        v-slot="{ errors }"
        name="Phone number"
        rules="required|min:7|max:20|phone"
      >
        <v-text-field
          v-model="user.phoneNumber"
          clearable
          :disabled="loading"
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
          :disabled="loading || inInvitationProcess"
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
        <v-text-field
          v-model="user.password"
          append-icon="mdi-lock"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Password"
          :loading="loading"
          maxlength="20"
          solo
          type="password"
        />
      </validation-provider>

      <!-- Password confirmation -->
      <validation-provider
        v-slot="{ errors }"
        name="Password confirmation"
        rules="required"
        vid="passwordConfirmation"
      >
        <v-text-field
          v-model="user.passwordConfirmation"
          append-icon="mdi-lock"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Password confirmation"
          :loading="loading"
          maxlength="20"
          solo
          type="password"
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
    </v-form>
  </validation-observer>
</template>

<script>
import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'SignupForm',

  props: {
    loading: Boolean
  },

  data: vm => ({
    user: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: vm.$route.query.email || '',
      password: '',
      passwordConfirmation: ''
    }
  }),

  computed: {
    inInvitationProcess () {
      const { query } = this.$route

      return Boolean(
        query.process === 'invitation' && query.email && query.token
      )
    }
  },

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
