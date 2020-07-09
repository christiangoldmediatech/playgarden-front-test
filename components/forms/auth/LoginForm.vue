<template>
  <v-form
    ref="loginForm"
    v-model="isValidForm"
    @submit.prevent="handleClick"
  >
    <!-- Email -->
    <v-text-field
      v-model="user.email"
      clearable
      :disabled="loading"
      label="Email"
      :loading="loading"
      outlined
      :rules="[required, isValidEmail]"
      type="email"
    />

    <!-- Password -->
    <v-text-field
      v-model="user.password"
      append-icon="mdi-lock"
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
      LOGIN
    </v-btn>

    <p class="forgot-password">
      <nuxt-link class="black--text" :to="{ name: 'auth-forgot-password' }">
        <underlined-subtitle
          class="clickable mt-2"
          text="Forgot Password"
        />
      </nuxt-link>
    </p>

    <p class="signup">
      Don't have an account?

      <nuxt-link :to="{ name: 'auth-signup' }">
        <span>SIGNUP</span>
      </nuxt-link>
    </p>
  </v-form>
</template>

<script>
import { required, isValidEmail, isValidPassword } from '@/utils/validations/forms'
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
        email: '',
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
          this.$emit('click:submit', jsonCopy({
            ...this.user
          }))
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
  font-size: 20px;

  span {
    color: $pg-main;
    text-transform: uppercase;
    font-weight: bold;
  }
}
</style>
