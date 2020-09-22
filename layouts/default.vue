<template>
  <v-app>
    <!-- APP MAV & BAR -->
    <app-navigation />

    <application-header />

    <!-- CONTENT -->
    <v-main v-if="!fullWidth">
      <v-container class="pa-md-3 pa-0" fill-height>
        <nuxt />
      </v-container>
    </v-main>

    <nuxt v-else />

    <!-- FOOTER -->
    <default-footer />

    <notify-event />

    <prompt-dialog />
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import AppNavigation from '@/components/app/header/AppNavigation'
import ApplicationHeader from '@/components/app/header/ApplicationHeader'
import DefaultFooter from '@/components/app/footer/DefaultFooter'

export default {
  name: 'Default',

  components: {
    ApplicationHeader,
    AppNavigation,
    DefaultFooter
  },

  data: () => ({
    verifyEmailToast: null
  }),

  middleware: ['checkJWT'],

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn', 'isUserEmailUnverified']),

    ...mapState(['fullWidthPages']),

    fullWidth () {
      return this.fullWidthPages[this.$route.name]
    }
  },

  watch: {
    '$route.name' (v) {
      if (v === 'auth-verify-email' && this.verifyEmailToast) {
        this.$snotify.remove(this.verifyEmailToast.id)
        this.verifyEmailToast = null
      } else if (!this.verifyEmailToast) {
        this.showVerifyEmailToast()
      }
    }
  },

  mounted () {
    this.showVerifyEmailToast()
  },

  methods: {
    showVerifyEmailToast () {
      if (
        this.isUserEmailUnverified &&
        this.isUserLoggedIn &&
        this.$route.name !== 'auth-verify-email' &&
        !this.verifyEmailToast
      ) {
        this.verifyEmailToast = this.$snotify.warning(
          'Missing email verification',
          'Unverified',
          {
            buttons: [
              {
                text: 'Verify',
                action: () => this.$router.push({ name: 'auth-verify-email' })
              }
            ],
            closeOnClick: false,
            timeout: 0
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-application ::v-deep {
  *,
  .display-1,
  .display-2,
  .display-3,
  .display-4,
  .headline,
  .title,
  .subtitle-1,
  .subtitle-2,
  .body-1,
  .body-2,
  .caption,
  .overline,
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h4,
  .text-h5,
  .text-h6 {
    font-family: "Poppins", sans-serif !important;
  }
  // .video-js * {
  //   font-family: VideoJS !important;
  //   color: white !important;
  // }
  .container:not(.container--fluid) {
    max-width: 1200px;
  }
  .v-text-field .v-input__control .v-input__slot {
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16) !important;
  }
  .pg-letter-spacing {
    letter-spacing: 6.75px !important;
  }
}
</style>
