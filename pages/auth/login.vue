<template>
  <v-row align="center" justify="center" no-gutters>
    <v-col cols="11" lg="4" md="6" sm="7" xl="3">
      <div class="image">
        <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
      </div>
    </v-col>

    <v-col cols="12" lg="5" md="6" xl="4">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
          <underlined-title text="Welcome back!" />
        </div>

        <login-form :loading="loading" @click:submit="onSubmit" />
      </div>
    </v-col>
  </v-row>
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

        await this.$router.push({ name: 'app-dashboard' })
      } catch (error) {
        this.errorMessage = 'Sorry! Wrong email or password'
      } finally {
        this.loading = false
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
}
.form {
  max-width: 500px;
}
.error-message {
  color: $pg-error;
}
</style>
