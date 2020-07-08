<template>
  <v-form
    ref="resetPasswordForm"
    v-model="isValidForm"
    @submit.prevent="handleClick"
  >
    <!-- Password -->
    <v-text-field
      v-model="password"
      clearable
      :disabled="loading"
      label="Password"
      :loading="loading"
      outlined
      :rules="[required, ...isValidPassword]"
      type="password"
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

    <p class="login mt-4">
      <nuxt-link :to="{ name: 'index' }">
        <span>return to login</span>
      </nuxt-link>
    </p>
  </v-form>
</template>

<script>
import { required, isValidPassword } from '@/utils/validations/forms.js'
import { jsonCopy } from '@/utils/objectTools.js'

export default {
  name: 'ResetPasswordForm',

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
      isValidPassword,
      isValidForm: true,
      password: ''
    }
  },

  computed: {
    isButtonDisabled () {
      return this.loading || !this.isValidForm
    }
  },

  methods: {
    handleClick () {
      if (this.$refs.resetPasswordForm) {
        this.$refs.resetPasswordForm.validate()
        if (this.isValidForm) {
          this.$emit('click:submit', jsonCopy({
            password: this.password
          }))
          this.$refs.resetPasswordForm.resetValidation()
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
</style>
