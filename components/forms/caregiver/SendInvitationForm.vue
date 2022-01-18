<template>
  <validation-observer v-slot="{ invalid, passes }">
    <p class="font-weight-bold">
      ADD NEW CAREGIVERS
    </p>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Email -->
      <validation-provider
        v-slot="{ errors }"
        name="Email"
        :rules="{
          required: !draft.phone,
          email: true
        }"
      >
        <pg-text-field
          v-model="draft.email"
          clearable
          :disabled="loading || Boolean(draft.phone)"
          :error-messages="errors"
          label="Email"
          :loading="loading"
          solo
          type="email"
        />
      </validation-provider>

      <!-- <v-row class="my-3" no-gutters>
        <v-col class="hr-line">
          <v-divider />
        </v-col>

        <v-col class="text-center">
          or
        </v-col>

        <v-col class="hr-line">
          <v-divider />
        </v-col>
      </v-row> -->

      <!-- Phone -->
      <!-- <validation-provider
        v-slot="{ errors }"
        name="Phone"
        :rules="{
          required: !draft.email,
          min: 7,
          max: 20,
          phone: true
        }"
      >
        <pg-text-field
          v-model="draft.phone"
          v-mask="['(###) ###-####']"
          class="mt-9"
          clearable
          :disabled="loading || Boolean(draft.email)"
          :error-messages="errors"
          label="Phone"
          :loading="loading"
          maxlength="20"
          solo
        />
      </validation-provider> -->

      <v-btn
        block
        class="mb-6"
        color="primary"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        x-large
      >
        SEND INVITES
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
        email: null,
        phone: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hr-line {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
