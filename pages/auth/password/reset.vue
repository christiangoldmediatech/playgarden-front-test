<template>
  <v-row align="center" justify="center" no-gutters>
    <v-col cols="11" md="6">
      <div class="image">
        <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div>
          <underlined-title text="Reset Password" />
        </div>

        <p v-show="errorMessage" class="error-message">
          <v-icon color="error">
            mdi-close-circle
          </v-icon>
          {{ errorMessage }}
        </p>

        <reset-password-form
          :loading="isLoadingForm"
          @click:submit="resetPassword"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import ResetPasswordForm from '@/components/forms/password/ResetPasswordForm.vue'

export default {
  name: 'Reset',

  components: {
    ResetPasswordForm
  },

  data () {
    return {
      token: '',
      isLoadingForm: false,
      errorMessage: ''
    }
  },

  async beforeMount () {
    try {
      if (!this.$route.query || !this.$route.query.token) {
        this.$router.push('/')
      } else {
        this.token = this.$route.query.token
        const { data } = await this.$axios.get(
          `${process.env.apiBaseUrl}/auth/password/validate/${this.token}`
        )
        if (!data.valid) {
          // TODO: Call global toast and tell user token expired
          this.$router.push('/')
        }
      }
    } catch (error) {
      // TODO: Call global toast and tell user something wen't wrong while validating token for password reset
      this.$router.push('/')
    }
  },

  methods: {
    async resetPassword (password) {
      try {
        this.isLoadingForm = true
        // TODO: move to store and use mapActions
        const { data } = await this.$axios.patch(
          `${process.env.apiBaseUrl}/auth/password/reset/${this.token}`,
          password
        )
        if (!data.changed) {
          throw new Error('password could not be changed')
        } else {
          this.errorMessage = ''
          // TODO: Call global toast and tell user password was succesfully changed
          this.$router.push('/')
        }
      } catch (error) {
        this.handleLoginError(error)
      } finally {
        this.isLoadingForm = false
      }
    },

    handleLoginError (error) {
      // TODO: Remove this alert to a global component
      this.errorMessage =
        'Sorry! An error ocurred while reseting your password'
      // eslint-disable-next-line
      console.error(error);
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    max-width: 90%;
  }
}
.form {
  max-width: 500px;
}
.error-message {
  color: var(--v-error-base);
}
</style>
