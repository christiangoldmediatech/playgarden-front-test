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

        <p class="text-center text-md-justify">
          Enter your email below to reset your password, and you will receive an email with further instructions
        </p>

        <forgot-password-form :loading="loading" @click:submit="onSubmit" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import ForgotPasswordForm from '@/components/forms/password/ForgotPasswordForm'

export default {
  name: 'ForgotPassword',

  components: {
    ForgotPasswordForm
  },

  data: () => ({
    loading: false
  }),

  methods: {
    ...mapActions('auth/password', ['forgotUserPassword']),

    async onSubmit (draft) {
      try {
        this.loading = true
        const { sent } = await this.forgotUserPassword(draft)

        if (sent) {
          this.$snotify.success('Instructions Sent!')
        } else {
          throw new Error('error')
        }
      } catch (e) {
        this.$snotify.error('Sorry! There was an error sending the reset password instructions')
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
  &.mobile {
    max-height: 250px;
    max-width: 250px;
  }
}
.form {
  max-width: 500px;
}
</style>
