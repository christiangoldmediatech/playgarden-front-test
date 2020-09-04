<template>
  <v-row align="center" justify="center" no-gutters>
    <v-col cols="11" md="6">
      <div class="image">
        <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
          <underlined-title text="Welcome to Playgarden Prep" />
        </div>

        <p class="mt-6 text-center text-md-left">
          We are happy you have you LEARN with us! Please check your email to confirm your account and start today
        </p>

        <v-btn
          v-if="isUserLoggedIn"
          block
          color="primary"
          :disabled="loading"
          :loading="loading"
          @click="onResend"
        >
          RETURN TO LOG IN
        </v-btn>

        <nuxt-link v-else :to="{ name: 'auth-login' }">
          <v-btn block color="primary">
            RETURN TO LOG IN
          </v-btn>
        </nuxt-link>

        <p class="mt-6 text-center text-md-left">
          Didn’t receive an email?

          <nuxt-link to="#">
            <span class="contact-color">CONTACT US</span>
          </nuxt-link>
        </p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Email',

  data: vm => ({
    loading: false,
    token: vm.$route.query.token
  }),

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn'])
  },

  created () {
    if (this.token) {
      this.onToken()
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

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

        if (this.isUserLoggedIn) {
          await this.fetchUserInfo()
        }

        await this.$snotify.success('Email has been verified successfully!')

        await this.$router.push({ name: 'index' })
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

.contact-color {
  color: $pg-btn-green !important;
}
</style>
