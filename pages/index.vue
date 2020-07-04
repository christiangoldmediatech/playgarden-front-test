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
            <underlined-title text="Welcome Back" />
          </div>
          <p v-show="errorMessage" class="error-message">
            <v-icon color="error">
              mdi-close-circle
            </v-icon>
            {{ errorMessage }}
          </p>
          <login-form :loading="isLoadingForm" @click:submit="handleLogin" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UnderlinedTitle from '@/components/global/UnderlinedTitle.vue'
import LoginForm from '@/components/forms/login/LoginForm.vue'

export default {
  components: {
    UnderlinedTitle,
    LoginForm
  },
  data () {
    return {
      isLoadingForm: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin (user) {
      try {
        this.isLoadingForm = true
        const { data } = await this.$axios.post(`${process.env.apiBaseUrl}/auth/login`, user)
        // set auth token
        this.errorMessage = ''
      } catch (error) {
        this.handleLoginError(error)
      } finally {
        this.isLoadingForm = false
      }
    },
    handleLoginError (error) {
      this.errorMessage = 'Sorry! Wrong email or password'
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
