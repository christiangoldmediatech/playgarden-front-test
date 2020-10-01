<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <v-form @submit.prevent="passes(onSubmit)">
      <!-- New password -->
      <validation-provider
        v-slot="{ errors }"
        name="New password"
        rules="required|min:8|max:20|w_number|w_special|w_upper"
        vid="password_field"
      >
        <pg-password-field
          v-model="draft.password"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="New password"
          :loading="loading"
          maxlength="20"
          solo
        />
      </validation-provider>

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
        CHANGE PASSWORD
      </v-btn>

      <v-btn
        block
        class="mb-6"
        color="accent"
        :loading="loading"
        text
        x-large
        @click="onCancel(reset)"
      >
        CANCEL
      </v-btn>
    </v-form>
  </validation-observer>
</template>

<script>
import submittable from '@/utils/mixins/submittable'

export default {
  name: 'UpdatePasswordForm',

  mixins: [submittable],

  props: {
    loading: Boolean
  },

  methods: {
    resetDraft () {
      this.draft = {
        password: '',
        passwordConfirmation: ''
      }
    }
  }
}
</script>
