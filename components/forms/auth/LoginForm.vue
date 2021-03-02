<template>
  <v-form ref="loginForm" v-model="isValidForm" @submit.prevent="handleClick">
    <!-- Email -->
    <pg-text-field
      v-model="user.email"
      clearable
      :disabled="loading"
      label="Email"
      :loading="loading"
      :rules="[required, isValidEmail]"
      solo
      type="email"
      class="custom-text-field"
    />

    <!-- Password -->
    <pg-password-field
      v-model="user.password"
      clearable
      :disabled="loading"
      label="Password"
      :loading="loading"
      :rules="[required, ...isValidPassword]"
      solo
      class="custom-text-field"
    />

    <v-btn
      block
      color="primary"
      min-height="60"
      class="main-btn"
      :disabled="isButtonDisabled"
      :loading="loading"
      type="submit"
      x-large
    >
      LOGIN
    </v-btn>

    <p class="forgot-password mt-6 mt-md-4 text-center text-md-right">
      <nuxt-link class="black--text" :to="{ name: 'auth-forgot-password' }">
        <underlined-title subtitle text="Forgot password?" />
      </nuxt-link>
    </p>

    <p class="signup text-center text-md-left">
      New to Playgarden Prep Online?

      <br class="hidden-md-and-up">

      <nuxt-link :to="{ name: 'auth-parent' }">
        <span>SIGN UP NOW!</span>
      </nuxt-link>
    </p>
  </v-form>
</template>

<script>
import {
  required,
  isValidEmail,
  isValidPassword
} from '@/utils/validations/forms'
import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'LoginForm',
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
      isValidPassword,
      isValidForm: true,
      user: {
        email: this.$route.query.email || '',
        password: ''
      }
    }
  },

  computed: {
    isButtonDisabled () {
      return this.loading || !this.isValidForm
    }
  },

  methods: {
    handleClick () {
      if (this.$refs.loginForm) {
        this.$refs.loginForm.validate()
        if (this.isValidForm) {
          this.$emit(
            'click:submit',
            jsonCopy({
              ...this.user
            })
          )
          this.user.password = ''
          this.$refs.loginForm.resetValidation()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.forgot-password {
  text-align: right;
}
.signup {
  font-size: 17px;
  font-weight: 500;

  span {
    color: var(--v-primary-base);
    text-transform: uppercase;
    font-weight: bold;
  }
}
</style>
