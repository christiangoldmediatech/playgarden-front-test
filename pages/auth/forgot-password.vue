<template>
  <v-row align="center" justify="center" no-gutters class="py-0 py-md-16">
    <v-col cols="12" md="6">
      <!-- CHILD IMAGE -->
      <div class="image">
        <v-img
          contain
          alt="Smiling Girl Picture"
          :src="require('@/assets/png/welcome-back.png')"
        />
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
          <underlined-title text="Reset Password" />
        </div>

        <p class="text-center text-md-justify">
          Enter your email below to reset your password, and you will receive an
          email with further instructions
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

  layout: 'iframe-header',

  components: {
    ForgotPasswordForm
  },

  data: () => ({
    loading: false
  }),

  methods: {
    ...mapActions('auth/password', ['forgotUserPassword']),

    async onSubmit(draft) {
      try {
        this.loading = true
        const { sent } = await this.forgotUserPassword(draft)

        if (sent) {
          this.$snotify.success('Instructions Sent!')
          setTimeout(() => {
            const from = this.$route.query.from

            if (from === 'community') {
              window.open('https://community.playgardenprep.com/login', '_self')
              return
            }

            this.$router.push('/')
          }, 2000)
        } else {
          throw new Error('error')
        }
      } catch (e) {
        this.$snotify.error(
          'Sorry! There was an error sending the reset password instructions'
        )
      } finally {
        this.loading = false
      }
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
</style>
