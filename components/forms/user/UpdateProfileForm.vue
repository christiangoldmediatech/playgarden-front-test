<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <v-form :readonly="!editing || loading" @submit.prevent="passes(onSubmit)">
      <p class="font-weight-bold">
        GENERAL
      </p>

      <!-- First name -->
      <validation-provider
        v-slot="{ errors }"
        name="firstName"
        rules="required"
      >
        <pg-text-field
          v-model="draft.firstName"
          class="custom-text-field"
          clearable
          :disabled="!editing || loading"
          :error-messages="errors"
          label="First name"
          :loading="loading"
          solo
        />
      </validation-provider>

      <!-- Last name -->
      <validation-provider
        v-slot="{ errors }"
        name="lastName"
        rules="required"
      >
        <pg-text-field
          v-model="draft.lastName"
          class="custom-text-field"
          clearable
          :disabled="!editing || loading"
          :error-messages="errors"
          label="Last name"
          :loading="loading"
          solo
        />
      </validation-provider>

      <!-- Phone number -->
      <validation-provider
        v-slot="{ errors }"
        name="phoneNumber"
        rules="required|min:7|max:20|phone"
      >
        <pg-text-field
          v-model="draft.phoneNumber"
          class="custom-text-field"
          clearable
          :disabled="!editing || loading"
          :error-messages="errors"
          label="Phone number"
          :loading="loading"
          maxlength="20"
          solo
        />
      </validation-provider>

      <template v-if="editing">
        <v-btn
          block
          class="mb-6"
          color="primary"
          :disabled="invalid"
          :loading="loading"
          type="submit"
          x-large
        >
          SAVE
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
      </template>
    </v-form>
  </validation-observer>
</template>

<script>
import submittable from '@/utils/mixins/submittable'

export default {
  name: 'UpdateProfileForm',

  mixins: [submittable],

  props: {
    editing: Boolean,

    loading: Boolean,

    user: {
      type: Object,
      required: true
    }
  },

  methods: {
    resetDraft () {
      this.draft = this.$jsonCopy({ ...this.user })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
</style>
