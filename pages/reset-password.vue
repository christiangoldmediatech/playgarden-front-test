<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="6">
        <div class="image">
          <img src="@/assets/svg/girl-smiling.svg" alt="Smiling Girl Picture">
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
          <reset-password-form :loading="isLoadingForm" @click:submit="handleResetPassword" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UnderlinedTitle from '@/components/global/UnderlinedTitle.vue'
import ResetPasswordForm from '@/components/forms/password/ResetPasswordForm.vue'

export default {
  middleware: ['redirectToAuthPage'],
  components: {
    UnderlinedTitle,
    ResetPasswordForm
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
        const { data } = await this.$axios.post(`${process.env.apiBaseUrl}/auth/password/forget`, email)
        this.errorMessage = ''
        this.successMessage = 'Email Sent!'
      } catch (error) {
        this.handleLoginError(error)
      } finally {
        this.isLoadingForm = false
      }
    },
    handleLoginError (error) {
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
