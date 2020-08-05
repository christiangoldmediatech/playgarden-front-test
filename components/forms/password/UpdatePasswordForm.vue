<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <v-form @submit.prevent="passes(onSubmit)">
      <!-- New password -->
      <validation-provider
        v-slot="{ errors }"
        name="New password"
        rules="required|min:8|max:20|w_number|w_special|w_upper|confirmed:passwordConfirmation"
      >
        <v-text-field
          v-model="draft.password"
          :append-icon="showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="New password"
          :loading="loading"
          maxlength="20"
          solo
          :type="showPass ? 'text' : 'password'"
          @click:append="showPass = !showPass"
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
          v-model="draft.passwordConfirmation"
          :append-icon="showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Password confirmation"
          :loading="loading"
          maxlength="20"
          solo
          :type="showPass ? 'text' : 'password'"
          @click:append="showPass = !showPass"
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
        color="primary"
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

  data: () => ({
    showPass: false
  }),

  methods: {
    resetDraft () {
      this.showPass = false

      this.draft = {
        password: '',
        passwordConfirmation: ''
      }
    }
  }
}
</script>
