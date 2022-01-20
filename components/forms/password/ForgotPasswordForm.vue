<template>
  <validation-observer v-slot="{ invalid, passes }">
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
          class="custom-text-field"
        />
      </validation-provider>

      <!-- <v-row class="my-0" no-gutters>
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
          class="mt-6 custom-text-field"
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
        color="green2"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        class="main-btn main-btn--black-base"
        x-large
      >
        SEND PASSWORD RESET LINK
      </v-btn>

      <p class="login mt-8">
        <nuxt-link class="primary--text" :to="{ name: 'index' }">
          <span class="return-link">return to login</span>
        </nuxt-link>
      </p>
    </v-form>
  </validation-observer>
</template>

<script>
import submittable from '@/utils/mixins/submittable'

export default {
  name: 'ForgotPasswordForm',

  mixins: [submittable],

  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
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

.login {
  color: var(--v-primary-base);
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  font-size: 20px;
}

.signup {
  font-size: 20px;

  span {
    color: var(--v-primary-base);
    text-transform: uppercase;
    font-weight: bold;
  }
}
.return-link {
  color:  var(--v-primary-base);
}
.main-btn--black-base{
  color:var(--v-black-base);
  &:hover{
    color:rgba(#000000, 0.8);
  }
}
</style>
