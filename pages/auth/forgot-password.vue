<template>
  <section>
    <v-row no-gutters>
      <v-col class="hidden-sm-and-down" cols="6">
        <div class="image">
          <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="form mx-auto px-4">
          <div>
            <underlined-title text="Reset Password" />
          </div>

          <p>
            Enter your email to reset your password. You will receive an email with instructions on how to reset your password.
          </p>

          <p v-show="errorMessage" class="error-message">
            <v-icon color="error">
              mdi-close-circle
            </v-icon>

            {{ errorMessage }}
          </p>

          <p v-show="successMessage" class="success-message">
            <v-icon color="success">
              mdi-checkbox-marked-circle-outline
            </v-icon>

            {{ successMessage }}
          </p>

          <forgot-password-form :loading="isLoadingForm" @click:submit="handleResetPassword" />
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import ForgotPasswordForm from '@/components/forms/password/ForgotPasswordForm'

export default {
  name: 'ForgotPassword',

  components: {
    ForgotPasswordForm
  },

  data () {
    return {
      isLoadingForm: false,
      errorMessage: '',
      successMessage: ''
    }
  },

  methods: {
    async handleResetPassword (email) {
      try {
        this.isLoadingForm = true
        // TODO: move to store and use mapActions
        const { data } = await this.$axios.post(`${process.env.apiBaseUrl}/auth/password/forget`, email)
        if (data.sent) {
          this.errorMessage = ''
          this.successMessage = 'Email Sent!'
        } else {
          throw new Error('error sending email')
        }
      } catch (error) {
        this.handleLoginError(error)
      } finally {
        this.isLoadingForm = false
      }
    },
    handleLoginError (error) {
      // TODO: Remove this alert to a global component
      this.successMessage = ''
      this.errorMessage = 'Sorry! There was an error sending the email'
      // eslint-disable-next-line
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  height: 100%;
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    height: 100%;
  }
}
.form {
  max-width: 500px;
}
.error-message {
  color: $pg-error;
}
</style>
