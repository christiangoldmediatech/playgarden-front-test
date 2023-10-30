<template>
  <v-form
    ref="resetPasswordForm"
    v-model="isValidForm"
    @submit.prevent="handleClick"
  >
    <!-- Password -->
    <pg-password-field
      v-model="password"
      clearable
      :disabled="loading"
      label="Password"
      :loading="loading"
      :rules="[required, ...isValidPassword]"
      solo
    />

    <v-btn
      block
      color="green2"
      :disabled="isButtonDisabled"
      :loading="loading"
      type="submit"
      class="main-btn--black-base"
      x-large
    >
      RESET PASSWORD
    </v-btn>

    <p class="login mt-4 text-center text-md-left">
      <nuxt-link :to="{ name: 'index' }">
        <span class="return-link">return to login</span>
      </nuxt-link>
    </p>
  </v-form>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useFormValidations } from '@/composables'
import { jsonCopy } from '@/utils/objectTools'

export default defineComponent({
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
      isValidForm: true,
      password: ''
    }
  },

  setup() {
    const {
      required,
      isValidPassword
    } = useFormValidations()

    return {
      required,
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
      if (this.$refs.resetPasswordForm) {
        this.$refs.resetPasswordForm.validate()
        if (this.isValidForm) {
          this.$emit(
            'click:submit',
            jsonCopy({
              password: this.password
            })
          )
          this.$refs.resetPasswordForm.resetValidation()
        }
      }
    }
  }
})
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
