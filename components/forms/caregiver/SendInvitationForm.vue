<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <div class="pr-3 text-center">
      <span class="font-weight-bold text-h5">
        NEW INVITATION
      </span>
    </div>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Email -->
      <validation-provider
        v-slot="{ errors }"
        name="Email"
        rules="required|email"
      >
        <v-text-field
          v-model="draft.email"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Email"
          :loading="loading"
          solo
          type="email"
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
        SEND INVITATION
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
  name: 'SendInvitationForm',

  mixins: [submittable],

  props: {
    loading: Boolean
  },

  methods: {
    resetDraft () {
      this.draft = {
        email: ''
      }
    }
  }
}
</script>
