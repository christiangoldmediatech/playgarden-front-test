<template>
  <v-form
    ref="forgotPasswordForm"
    v-model="isValidForm"
    @submit.prevent="handleClick"
  >
    <!-- Email -->
    <v-text-field
      v-model="email"
      clearable
      :disabled="loading"
      label="Email"
      :loading="loading"
      outlined
      :rules="[required, isValidEmail]"
      type="email"
    />

    <v-btn
      block
      color="primary"
      :disabled="isButtonDisabled"
      :loading="loading"
      type="submit"
    >
      RESET PASSWORD
    </v-btn>

    <v-row class="my-3" no-gutters>
      <v-col class="hr-line">
        <v-divider />
      </v-col>

      <v-col class="text-center">
        or
      </v-col>

      <v-col class="hr-line">
        <v-divider />
      </v-col>
    </v-row>

    <p class="login mt-4">
      <nuxt-link class="primary--text" :to="{ name: 'index' }">
        <span>return to login</span>
      </nuxt-link>
    </p>

    <p class="mt-4 signup">
      Don't have an account?

      <nuxt-link :to="{ name: 'auth-signup' }">
        <span>SIGNUP</span>
      </nuxt-link>
    </p>
  </v-form>
</template>

<script>
import { required, isValidEmail } from '@/utils/validations/forms.js'
import { jsonCopy } from '@/utils/objectTools.js'

export default {
  name: 'ForgotPasswordForm',

  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      required,
      isValidEmail,
      isValidForm: true,
      email: ''
    }
  },

  computed: {
    isButtonDisabled () {
      return this.loading || !this.isValidForm
    }
  },

  methods: {
    handleClick () {
      if (this.$refs.forgotPasswordForm) {
        this.$refs.forgotPasswordForm.validate()
        if (this.isValidForm) {
          this.$emit('click:submit', jsonCopy({
            email: this.email
          }))
          this.$refs.forgotPasswordForm.resetValidation()
        }
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
  color: $pg-main;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  font-size: 20px;
}
.signup {
  font-size: 20px;
  span {
    color: $pg-main;
    text-transform: uppercase;
    font-weight: bold;
  }
}
</style>
