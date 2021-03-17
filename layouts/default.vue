<template>
  <v-app>
    <coming-soon-player />
    <!-- APP MAV & BAR -->
    <app-navigation />

    <application-header />

    <!-- NOTIFICATION CARD -->
    <notification-card />
    <!-- SHIPPING NOTIFICATION MODAL -->
    <shipping-address-modal />

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
import { mapGetters, mapState, mapActions } from 'vuex'
import dayjs from 'dayjs'

import ApplicationHeader from '@/components/app/header/ApplicationHeader'
import AppNavigation from '@/components/app/header/AppNavigation'
import ComingSoonDialog from '@/components/app/ComingSoonDialog'
import ComingSoonPlayer from '@/components/app/ComingSoonPlayer.vue'
import DefaultFooter from '@/components/app/footer/DefaultFooter'
import NotificationCard from '@/components/app/notifications/NotificationCard'
import ShippingAddressModal from '~/components/app/payment/ShippingAddressModal.vue'

export default {
  name: 'Default',

  components: {
    ApplicationHeader,
    AppNavigation,
    ComingSoonDialog,
    ComingSoonPlayer,
    DefaultFooter,
    NotificationCard,
    ShippingAddressModal
  },

  data: () => ({
    isComingSoonDialogOpen: false,
    verifyEmailToast: null
  }),

  middleware: ['checkJWT'],

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn', 'getUserInfo', 'isUserEmailUnverified']),

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

  async mounted () {
    // Commented requested by Natalia
    // this.showVerifyEmailToast()

    /**
     * Show a notification prompting the user to update their shipping address if:
     * - The user doesn't have the shipping address on file, and
     * - 2 days or more have past.
     */
    if (this.isUserLoggedIn) {
      try {
        await this.getShippingAddress()
      } catch (error) {
        if (error?.response?.status === 404) {
          const createdAt = this.getUserInfo.createdAt
          const daysDifference = dayjs(new Date()).diff(dayjs(createdAt), 'days')

          if (daysDifference >= 2) {
            this.$store.commit('notifications/SET_NOTIFICATION_CARD', {
              title: 'WE WANT TO SEND YOU A WELCOME KIT!',
              description: 'We require a shipping address in order to send the Welcome Kit with Backpack, workbooks, and additional materials.',
              action: () => this.$store.commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', true),
              image: require('@/assets/png/megaphone.png')
            })
          }
        }
      }
    }
  },

  methods: {
    ...mapActions('shipping-address', ['getShippingAddress']),

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
