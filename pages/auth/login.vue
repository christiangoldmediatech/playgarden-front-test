<template>
  <section>
    <v-row no-gutters>
      <v-col cols="12" md="6">
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

          <login-form :loading="loading" @click:submit="onSubmit" />
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

import LoginForm from '@/components/forms/auth/LoginForm'

export default {
  name: 'Login',

  components: {
    LoginForm
  },

  data () {
    return {
      loading: false,
      errorMessage: ''
    }
  },

  methods: {
    ...mapActions('auth/login', ['login']),

    async onSubmit (data) {
      try {
        this.loading = true
        this.errorMessage = ''

        await this.login(data)

        await this.$router.push({ name: 'app-children' })
      } catch (error) {
        this.errorMessage = 'Sorry! Wrong email or password'
      }

      this.loading = false
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
    max-width: 90%;
  }
}
.form {
  max-width: 500px;
}
.error-message {
  color: $pg-error;
}
</style>
