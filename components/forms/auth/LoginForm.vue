<template>
  <v-form ref="loginForm" v-model="isValidForm" @submit.prevent="handleClick">
    <!-- Email -->
    <pg-text-field
      v-model="user.email"
      clearable
      :disabled="loading"
      :label="$t('commonWords.emailPlaceholder')"
      :loading="loading"
      :rules="[required, isValidEmail]"
      solo
      type="email"
      class="custom-text-field"
      data-test-id="email-field"
    />

    <!-- Password -->
    <pg-password-field
      v-model="user.password"
      clearable
      :disabled="loading"
      :label="$t('commonWords.passwordPlaceholder')"
      :loading="loading"
      :rules="[required, ...isValidPassword]"
      solo
      class="custom-text-field"
      data-test-id="password-field"
    />

    <v-btn
      block
      color="#B2E68D"
      min-height="60"
      class="main-btn !pg-text-white"
      :disabled="isButtonDisabled"
      :loading="loading"
      type="submit"
      x-large
      data-test-id="login-button"
    >
      {{ $t('login.loginBtn') }}
    </v-btn>

    <p class="forgot-password mt-6 mt-md-4 text-center text-md-right">
      <nuxt-link class="black--text" :to="{ name: 'auth-forgot-password' }">
        <underlined-title subtitle :text="$t('login.forgotPassword')" />
      </nuxt-link>
    </p>

    <p class="signup text-center text-md-left">
      {{ $t('login.invitationText') }}

      <br class="hidden-md-and-up">

      <nuxt-link :to="{ name: 'auth-preschool-normal', query: { step: 1 } }">
        <span>{{ $t('login.signUpInvitation') }}</span>
      </nuxt-link>
    </p>
  </v-form>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useFormValidations } from '@/composables'
import { jsonCopy } from '@/utils/objectTools'

export default defineComponent({
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
      isValidForm: true,
      user: {
        email: this.$route.query.email || '',
        password: ''
      }
    }
  },

  setup() {
    const {
      required,
      isValidEmail,
      isValidPassword
    } = useFormValidations()

    return {
      required,
      isValidEmail,
      isValidPassword
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
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

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
.main-btn--black-base{
  color:var(--v-black-base);
  &:hover{
    color:rgba(#000000, 0.8);
  }
}
</style>
