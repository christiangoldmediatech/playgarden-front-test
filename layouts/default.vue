<template>
  <v-app>
    <template v-if="showContent">
      <!-- TRIAL EXPIRING RIBBON -->
      <trial-is-expiring v-if="isTrialExpiringRibbonVisible" />

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
      <trial-ending-week-two-modal />
      <trial-ending-week-three-modal />
      <trial-ending-week-four-modal />
      <PlanUpgradeModal v-if="isUserLoggedIn" />
      <TrialEndingModalForLastDay :downward-displacement="topDistanceInPixels" />
      <trial-ending-plan-selected />

      <!-- CONTACT US FORM MODAL -->
      <contact-us-form-modal />

      <!-- NOTIFICATION SIGNUP -->
      <notification-signup-modal />

      <!-- CHANGE PASSWORD ON FIRST LOGIN -->
      <change-password-modal />

      <!-- CONTENT -->
      <v-main v-if="!isFullWidth">
        <v-container
          class="pa-md-3 pa-0"
          fill-height
          :style="contentStyle"
        >
          <nuxt />
        </v-container>
      </v-main>

      <v-container v-else fluid class="px-0 fill-height">
        <nuxt :style="contentStyle" class="mt-2" />
      </v-container>

      <!-- FOOTER -->
      <default-footer />

      <notify-event />

      <prompt-dialog />

      <coming-soon-dialog :showing="isComingSoonDialogOpen" />
    </template>

    <template v-else>
      <v-main>
        <v-container
          fill-height
          fluid
        >
          <pg-loading />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<script>
import { defineComponent, useRoute, useStore } from '@nuxtjs/composition-api'
import { computed, onMounted, ref, watch } from '@vue/composition-api'

import ApplicationHeader from '@/components/app/header/ApplicationHeader.vue'
import AppNavigation from '@/components/app/header/AppNavigation.vue'
import ComingSoonDialog from '@/components/app/ComingSoonDialog.vue'
import ComingSoonPlayer from '@/components/app/ComingSoonPlayer.vue'
import DefaultFooter from '@/components/app/footer/DefaultFooter.vue'
import NotificationCard from '@/components/app/notifications/NotificationCard.vue'
import ShippingAddressModal from '@/components/app/payment/ShippingAddressModal.vue'
import TrialExpiredModal from '@/components/app/payment/TrialExpiredModal.vue'
import TrialEndingWeekTwoModal from '@/components/app/payment/TrialEnding/WeekTwoModal.vue'
import TrialEndingWeekThreeModal from '@/components/app/payment/TrialEnding/WeekThreeModal.vue'
import TrialEndingWeekFourModal from '@/components/app/payment/TrialEnding/WeekFourModal.vue'
import TrialIsExpiring from '@/components/app/header/TrialIsExpiring.vue'
import ContactUsFormModal from '@/components/forms/contact/ContactUsFormModal.vue'
import NotificationSignupModal from '@/components/app/notifications/NotificationSignupModal.vue'
import ChangePasswordModal from '@/components/app/notifications/ChangePasswordModal.vue'
import TrialEndingModalForLastDay from '@/components/app/payment/TrialEnding/TrialEndingModalForLastDay.vue'
import PlanUpgradeModal from '@/components/app/payment/TrialEnding/PlanUpgradeModal/index.vue'

import { useAuth, useLayout, useNotification, useVuetifyHelper } from '@/composables'

export default defineComponent({
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
    NotificationSignupModal,
    ChangePasswordModal,
    TrialEndingModalForLastDay,
    TrialEndingWeekTwoModal,
    TrialEndingWeekThreeModal,
    TrialEndingWeekFourModal,
    PlanUpgradeModal,
    TrialEndingPlanSelected: () => import('@/components/app/payment/TrialEnding/PlanSelected.vue')
  },

  setup () {
    const isComingSoonDialogOpen = ref(false)

    const store = useStore()
    const route = useRoute()
    const vuetify = useVuetifyHelper()

    const {
      isTrialExpiringRibbonVisible,
      expiringRibbonHeightDesktop,
      expiringRibbonHeightMobile,
      checkIfShouldSendShippingAddressNotification,
      checkIfShouldShowTrialExpiringRibbon,
      checkIfShouldShowTrialExpiredModal
    } = useNotification({ store })

    const { showContent, setShowContent, isFullWidth } = useLayout({ store, route, vuetify })

    const { isUserLoggedIn, isUserEmailVerified } = useAuth({ store })

    const routeName = computed(() => route.value.name)

    watch(routeName, async () => {
      if (routeName.value !== 'app-payment-plan') {
        await checkIfShouldShowTrialExpiredModal()
      }
    })

    onMounted(() => {
      watch(isUserLoggedIn, async () => {
        if (routeName.value !== 'shared-slug') {
          await checkIfShouldSendShippingAddressNotification()
          await checkIfShouldShowTrialExpiredModal()
          await checkIfShouldShowTrialExpiringRibbon()
        }
      }, { immediate: true })

      setShowContent(true)
    })

    const isMobile = computed(() => vuetify.breakpoint.mobile)

    return {
      isComingSoonDialogOpen,
      isTrialExpiringRibbonVisible,
      expiringRibbonHeightDesktop,
      expiringRibbonHeightMobile,
      showContent,
      setShowContent,
      isUserLoggedIn,
      isUserEmailVerified,
      isFullWidth,
      isMobile
    }
  },

  computed: {
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
  }
})
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
