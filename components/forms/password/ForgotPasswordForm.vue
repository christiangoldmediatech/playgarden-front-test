<template>
  <v-form
    ref="forgotPasswordForm"
    v-model="isValidForm"
    @submit.prevent="handleClick"
  >
    <!-- Email -->
    <v-text-field
      v-model="email"
      :disabled="loading"
      :rules="[required, isValidEmail]"
      :loading="loading"
      outlined
      label="Email"
      clearable
      type="email"
    />
    <v-btn
      color="primary"
      type="submit"
      block
      :loading="loading"
      :disabled="isButtonDisabled"
    >
      RESET PASSWORD
    </v-btn>
    <v-row no-gutters class="my-3">
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
    <p class="login my-4 clickable" @click="goTo('/')">
      return to login
    </p>
    <p class="signup mt-4">
      Don't have an account?
      <span
        class="clickable"
        @click="$router.push('/signup')"
      >
        SIGNUP
      </span>
    </p>
  </v-form>
</template>

<script>
import { required, isValidEmail } from '@/utils/validations/forms.js'
import { jsonCopy } from '@/utils/objectTools.js'

export default {
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
    goTo (route) {
      this.$router.push(route)
    },
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
