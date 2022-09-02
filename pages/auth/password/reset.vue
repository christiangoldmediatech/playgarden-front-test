<template>
  <v-row align="center" justify="center" no-gutters class="py-0 py-md-16">
    <v-col class="d-flex justify-center" cols="11" md="6">
      <div class="image mt-4 mt-md-0" :class="{mobile: $vuetify.breakpoint.smAndDown}">
        <img alt="Smiling Girl Picture" src="@/assets/png/welcome-back.png">
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

  created() {
    this.clearStorage()
    this.deleteAllCookies()
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
    },

    clearStorage() {
      localStorage.clear()
    },

    deleteAllCookies() {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
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
  &.mobile {
    max-height: 250px;
    max-width: 250px;
  }
}
.form {
  max-width: 500px;
}
.error-message {
  color: var(--v-error-base);
}
</style>
