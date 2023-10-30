<template>
  <validation-observer v-slot="{ invalid, passes }">
    <p class="title">
      {{ $t('account.caregivers.addNewCaregiver') }}
    </p>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Email -->
      <validation-provider
        v-slot="{ errors }"
        name="email"
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
          background-color="#F7F7F7"
          color="#AAAAAA"
          solo
          flat
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
        name="phone"
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
        class="mb-6 rounded-0"
        color="primary"
        elevation="0"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        large
      >
        {{ $t('account.caregivers.sendInvitation') }}
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
.title {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  color: #707070;
}

.hr-line {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .v-text-field .v-input__control .v-input__slot input {
  color: #AAAAAA !important;
}

::v-deep .v-text-field .v-input__control .v-input__slot label {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  color: #707070;
}
</style>
