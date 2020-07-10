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
            <underlined-title text="Welcome to Playgarden Prep" />
          </div>

          <p>
            <small>We are happy to have you! Check your email to confirm your
              account and start enjoying our learning experience.</small>
          </p>

          <p>
            Didn't receive an email?
          </p>

          <v-btn
            v-if="(userInfo || {}).id"
            block
            color="primary"
            :disabled="loading"
            :loading="loading"
            @click="onResend"
          >
            RESEND EMAIL
          </v-btn>

          <v-btn block class="mt-6" color="primary" :loading="loading" text>
            CONTACT US
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'VerifyEmail',

  data: vm => ({
    loading: false,
    token: vm.$route.query.token
  }),

  computed: {
    ...mapGetters('auth', { userInfo: 'getUserInfo' })
  },

  created () {
    if (this.token) {
      this.onToken()
    }
  },

  methods: {
    ...mapActions('auth/verify', ['resendEmail', 'validateRegister']),

    async onResend () {
      this.loading = true

      try {
        await this.resendEmail()

        await this.$snotify.success('Email has been sent successfully!')
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onToken () {
      this.loading = true

      try {
        await this.validateRegister(this.token)

        await this.$snotify.success('Email has been verified successfully!')

        await this.$router.push({ name: 'app-children' })
      } catch (e) {
      } finally {
        this.loading = false
      }
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
</style>
