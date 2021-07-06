<template>
  <v-app>
    <template v-if="showContent">
      <!-- TRIAL EXPIRING RIBBON -->
      <trial-is-expiring v-if="isTrialExpiringRibbonVisible" @expired="handleExpiredTrialCoundown" />

      <coming-soon-player />

      <!-- APP MAV & BAR -->
      <app-navigation />

      <application-header :style="toolbarStyle" />

      <!-- NOTIFICATION CARD -->
      <notification-card />

      <!-- SHIPPING NOTIFICATION MODAL -->
      <shipping-address-modal />

      <!-- TRIAL EXPIRED MODAL -->
      <trial-expired-modal />

      <!-- CONTACT US FORM MODAL -->
      <contact-us-form-modal />

      <!-- NOTIFICATION SIGNUP -->
      <notification-signup-modal />

      <!-- CONTENT -->
      <v-main v-if="!fullWidth">
        <v-container class="pa-md-3 pa-0" fill-height :style="contentStyle">
          <nuxt />
        </v-container>
      </v-main>

      <nuxt v-else :style="contentStyle" />

      <!-- FOOTER -->
      <default-footer />

      <notify-event />

      <prompt-dialog />

      <coming-soon-dialog :showing="isComingSoonDialogOpen" />
    </template>

    <template v-else>
      <v-main>
        <v-container fill-height fluid>
          <pg-loading />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

import ApplicationHeader from '@/components/app/header/ApplicationHeader'
import AppNavigation from '@/components/app/header/AppNavigation'
import ComingSoonDialog from '@/components/app/ComingSoonDialog'
import ComingSoonPlayer from '@/components/app/ComingSoonPlayer.vue'
import DefaultFooter from '@/components/app/footer/DefaultFooter'
import NotificationCard from '@/components/app/notifications/NotificationCard'
import ShippingAddressModal from '@/components/app/payment/ShippingAddressModal.vue'
import TrialExpiredModal from '@/components/app/payment/TrialExpiredModal.vue'
import TrialIsExpiring from '@/components/app/header/TrialIsExpiring.vue'
import ContactUsFormModal from '@/components/forms/contact/ContactUsFormModal.vue'
import NotificationSignupModal from '@/components/app/notifications/NotificationSignupModal'

export default {
  name: 'Default',

  middleware: ['utmHandler'],

  components: {
    ApplicationHeader,
    AppNavigation,
    ComingSoonDialog,
    ComingSoonPlayer,
    DefaultFooter,
    NotificationCard,
    ShippingAddressModal,
    TrialExpiredModal,
    TrialIsExpiring,
    ContactUsFormModal,
    NotificationSignupModal
  },

  data: () => ({
    isComingSoonDialogOpen: false,
    verifyEmailToast: null
  }),

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn', 'isUserEmailUnverified']),

    ...mapState(['fullWidthPages', 'showContent']),

    ...mapState('notifications', ['isTrialExpiringRibbonVisible', 'expiringRibbonHeightDesktop', 'expiringRibbonHeightMobile']),

    fullWidth () {
      return this.fullWidthPages[this.$route.name]
    },

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    },

    topDistanceInPixels () {
      return this.isMobile ? this.expiringRibbonHeightMobile : this.expiringRibbonHeightDesktop
    },

    toolbarStyle () {
      return {
        top: this.isTrialExpiringRibbonVisible ? `${this.topDistanceInPixels}px !important` : '0px'
      }
    },

    contentStyle () {
      return {
        'margin-top': this.isTrialExpiringRibbonVisible ? `${this.topDistanceInPixels}px !important` : '0px'
      }
    }
  },

  watch: {
    isUserLoggedIn: {
      immediate: true,
      async handler (v) {
        if (v === true && this.$route.name !== 'shared-slug') {
          await this.checkIfShouldSendShippingAddressNotification()
          await this.checkIfShouldShowTrialExpiredModal()
          await this.checkIfShouldShowTrialExpiringRibbon()
        }
      }
    },
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

    this.$store.commit('SET_SHOW_CONTENT', true)
  },

  methods: {
    ...mapActions('notifications', [
      'checkIfShouldSendShippingAddressNotification',
      'checkIfShouldShowTrialExpiredModal',
      'checkIfShouldShowTrialExpiringRibbon'
    ]),

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
    },

    handleExpiredTrialCoundown () {
      this.$router.push({ name: 'app-payment-plan' })
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
