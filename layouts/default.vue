<template>
  <v-app>
    <coming-soon-player />
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

    <coming-soon-dialog :showing="isComingSoonDialogOpen" />
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import AppNavigation from '@/components/app/header/AppNavigation'
import ApplicationHeader from '@/components/app/header/ApplicationHeader'
import DefaultFooter from '@/components/app/footer/DefaultFooter'
import ComingSoonDialog from '@/components/app/ComingSoonDialog'
import ComingSoonPlayer from '@/components/app/ComingSoonPlayer.vue'

export default {
  name: 'Default',

  components: {
    ApplicationHeader,
    AppNavigation,
    DefaultFooter,
    ComingSoonDialog,
    ComingSoonPlayer
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
        // Commented requested by Natalia
        // this.showVerifyEmailToast()
      }
    }
  },

  mounted () {
    // Commented requested by Natalia
    // this.showVerifyEmailToast()
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
          'Please verify your account',
          'Warning',
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
