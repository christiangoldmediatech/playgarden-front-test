<template>
  <v-row align="center" justify="center" no-gutters class="py-0 py-md-16">
    <v-col cols="12" md="6">
      <!-- CHILD IMAGE -->
      <div
        class="image"
      >
        <v-img contain alt="Smiling Girl Picture" :src="require('@/assets/png/welcome-back.png')" />
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
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
import { mapActions } from 'vuex'

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
    // Clear state
    this.logout()

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
    ...mapActions('auth', ['logout']),

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
  margin-top: 48px;
  max-height: 500px;
  display: flex;
  justify-content: center;
  align-content: center;
}
@media (max-width: $breakpoint-md) {
  .image {
    margin-top: 80px;
  }
}
@media (max-width: $breakpoint-sm) {
  .image {
    max-height: 250px;
  }
}
.form {
  max-width: 500px;
}
.error-message {
  color: var(--v-error-base);
}
</style>
