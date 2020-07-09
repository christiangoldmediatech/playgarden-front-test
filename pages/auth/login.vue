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
  </section>
</template>

<script>
import LoginForm from '@/components/forms/auth/LoginForm'

export default {
  name: 'Login',

  components: {
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
        // TODO: move to store and use mapActions
        const { data } = await this.$axios.post('/auth/login', user)
        // set auth token
        this.$store.dispatch('auth/setToken', data.accessToken)
        this.errorMessage = ''
        this.$router.push({ name: 'app-children' })
      } catch (error) {
        this.handleLoginError(error)
      } finally {
        this.isLoadingForm = false
      }
    },
    handleLoginError (error) {
      // TODO: Remove this alert to a global component
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
