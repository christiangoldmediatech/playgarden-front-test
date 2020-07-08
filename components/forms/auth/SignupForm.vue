<template>
  <ValidationObserver v-slot="{ invalid, validated, passes }">
    <v-form
      @submit.prevent="passes(handleClick)"
    >
      <!-- First name -->
      <ValidationProvider v-slot="{ errors }" name="First name" rules="required">
        <v-text-field
          v-model="user.firstName"
          :disabled="loading"
          :error-messages="errors"
          :loading="loading"
          label="First name"
          outlined
          clearable
        />
      </ValidationProvider>

      <!-- Last name -->
      <ValidationProvider v-slot="{ errors }" name="Last name" rules="required">
        <v-text-field
          v-model="user.lastName"
          :disabled="loading"
          :error-messages="errors"
          :loading="loading"
          label="Last name"
          outlined
          clearable
        />
      </ValidationProvider>

      <!-- Phone number -->
      <ValidationProvider v-slot="{ errors }" name="Phone number" rules="required|min:7|max:20|phone">
        <v-text-field
          v-model="user.phoneNumber"
          :disabled="loading"
          :error-messages="errors"
          :loading="loading"
          label="Phone number"
          outlined
          clearable
          maxlength="20"
        />
      </ValidationProvider>

      <!-- Email -->
      <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
        <v-text-field
          v-model="user.email"
          :disabled="loading"
          :error-messages="errors"
          :loading="loading"
          label="Email"
          outlined
          clearable
          type="email"
        />
      </ValidationProvider>

      <!-- Password -->
      <ValidationProvider v-slot="{ errors }" name="Password" rules="required|min:8|max:20|w_number|w_special|w_upper|confirmed:passwordConfirmation">
        <v-text-field
          v-model="user.password"
          :disabled="loading"
          :error-messages="errors"
          :loading="loading"
          append-icon="mdi-lock"
          outlined
          label="Password"
          clearable
          type="password"
          maxlength="20"
        />
      </ValidationProvider>

      <!-- Password -->
      <ValidationProvider v-slot="{ errors }" name="Password confirmation" vid="passwordConfirmation">
        <v-text-field
          v-model="user.passwordConfirmation"
          :disabled="loading"
          :error-messages="errors"
          :loading="loading"
          append-icon="mdi-lock"
          outlined
          label="Password confirmation"
          clearable
          type="password"
          maxlength="20"
        />
      </ValidationProvider>

      <v-btn
        class="mb-6"
        color="primary"
        type="submit"
        block
        :loading="loading"
        :disabled="invalid"
      >
        SIGNUP
      </v-btn>
    </v-form>
  </ValidationObserver>
</template>

<script>
import { jsonCopy } from '~/utils/objectTools.js'

export default {
  name: 'SignupForm',

  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    user: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  }),

  methods: {
    handleClick () {
      this.$emit('click:submit', jsonCopy({
        ...this.user
      }))
    }
  }
}
</script>
