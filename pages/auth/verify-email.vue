<template>
  <section>
    <v-row align="center" justify="center" no-gutters>
      <v-col cols="11" lg="4" md="6" sm="7" xl="3">
        <div class="image">
          <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
        </div>
      </v-col>

      <v-col cols="12" lg="5" md="6" xl="4">
        <div class="form mx-auto px-4">
          <div class="my-5 my-md-0 text-center text-md-left">
            <underlined-title
              :class="[{'text-h5 font-weight-bold text-uppercase': $vuetify.breakpoint.smAndDown }, {'text-none': $vuetify.breakpoint.mdAndUp}]"
              text="Welcome to Playgarden Prep"
              :underline="$vuetify.breakpoint.mdAndUp"
            />
          </div>

          <p class="text-center text-md-left">
            <small>We are happy to have you! Check your email to confirm your
              account and start enjoying our learning experience.</small>
          </p>

          <v-btn
            v-if="(userInfo || {}).id"
            block
            color="primary"
            :disabled="loading"
            :loading="loading"
            x-large
            @click="onResend"
          >
            RESEND EMAIL
          </v-btn>

          <nuxt-link v-else :to="{ name: 'auth-login' }">
            <v-btn block color="primary">
              RETURN TO LOG IN
            </v-btn>
          </nuxt-link>

          <p class="mt-6 signup text-center text-md-left">
            Didn’t receive an email?
            <nuxt-link to="#">
              <span>CONTACT US</span>
            </nuxt-link>
          </p>
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
        await this.fetchUserInfo()

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
</style>
