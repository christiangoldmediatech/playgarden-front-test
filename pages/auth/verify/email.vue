<template>
  <v-row align="center" justify="center" no-gutters>
    <v-col cols="11" md="6">
      <div class="image py-4 mt-md-0" :class="{mobile: $vuetify.breakpoint.smAndDown}">
        <img alt="Smiling Girl Picture" src="@/assets/png/welcome-back.png">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
          <underlined-title text="Welcome to Playgarden Prep Online!" />
        </div>

        <p class="mt-6 text-center text-md-left">
          <span>We are so excited to welcome your little one to the Playgarden Prep Online community!</span>
        </p>
        <p class="text-center text-md-left">
          <span>Please check your email to confirm your account and start learning.</span>
        </p>

        <!-- <v-btn
          v-if="isUserLoggedIn"
          block
          color="primary"
          class="main-btn"
          min-height="60"
          :disabled="loading"
          :loading="loading"
          @click="goToLessons"
        >
          GO TO LESSONS
        </v-btn> -->

        <!-- <nuxt-link :to="{ name: 'auth-login' }">
          <v-btn block color="primary">
            RETURN TO LOG IN
          </v-btn>
        </nuxt-link> -->

        <p class="mt-6 text-center text-md-left">
          Didn't receive an email?
        </p>
        <div>
          <v-btn
            color="primary"
            block
            @click="onResend"
          >
            RESEND EMAIL
          </v-btn>
        </div>
        <p class="mt-6 text-center text-md-left">
          Need support?

          <v-btn
            color="primary"
            small
            text
            @click="showContactUsModal"
          >
            CONTACT US
          </v-btn>
        </p>

        <nuxt-link v-if="isUserLoggedIn" :to="{ name: 'auth-logout' }">
          <v-btn block color="accent" class="mt-4">
            LOG OUT
          </v-btn>
        </nuxt-link>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'

export default defineComponent({
  name: 'Email',

  setup () {
    const store = useStore()
    const { showContactUsModal } = useGlobalModal({ store })

    return {
      showContactUsModal
    }
  },

  data: vm => ({
    loading: false,
    token: vm.$route.query.token
  }),

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn'])
  },

  async created () {
    if (!this.isUserLoggedIn) {
      await this.restoreAuthFromSessionStorage()

      const didRecoverSession = await this.checkAuth()

      if (didRecoverSession) {
        if (!this.isUserLoggedIn) {
          await this.fetchUserInfo()
        }
      }
    }
    if (this.token) {
      this.onToken()
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo', 'restoreAuthFromSessionStorage', 'checkAuth']),

    ...mapActions('auth/verify', [
      'resendEmail',
      'validateRegister',
      'completeRegister'
    ]),

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
    },

    async goToLessons () {
      this.loading = true

      try {
        await this.completeRegister()

        if (this.isUserLoggedIn) {
          await this.fetchUserInfo()
        }

        await this.$router.push({ name: 'index' })
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
})
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
  }
}
.form {
  max-width: 500px;
}

.contact-color {
  color: var(--v-primary-base) !important;
  font-weight: bold !important;
}
</style>
