<template>
  <v-app>
    <template v-if="showContent">
      <!-- TRIAL EXPIRING RIBBON -->
      <trial-is-expiring
        v-if="isTrialExpiringRibbonVisible"
        @expired="handleExpiredTrialCoundown"
      />

      <!-- APP HEADER -->
      <pg-header />

      <!-- APP MAV -->
      <app-navigation />

      <!-- NOTIFICATION CARD -->
      <notification-card />

      <!-- SHIPPING NOTIFICATION MODAL -->
      <shipping-address-modal />

      <!-- TRIAL EXPIRED MODAL -->
      <trial-expired-modal />

      <!-- CONTACT US FORM MODAL -->
      <contact-us-form-modal />

      <!-- NO CREDIT CARD FLOW TRIAL EXPIRED -->
      <!-- <no-credit-card-free-trial-ended-dialog
        v-model="isPreschoolTrialEndedWithNoCreditCardFlowModalVisible"
      /> -->

      <!-- CONTENT -->
      <v-main v-if="!isFullWidth">
        <v-container class="pa-md-3 pa-0" fill-height :style="contentStyle">
          <nuxt />
        </v-container>
      </v-main>

      <nuxt v-else :style="contentStyle" />

      <!-- FOOTER -->
      <default-footer />

      <notify-event />

      <prompt-dialog />
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

<script lang="ts">
import {
  useAuth,
  useLayout,
  useNotification,
  useVuetifyHelper
} from '@/composables'
import { TypedStore } from '@/models'
import { useRoute, useRouter, useStore } from '@nuxtjs/composition-api'
import {
  computed,
  defineComponent,
  onMounted,
  watch
} from '@vue/composition-api'

import AppNavigation from '@/components/app/header/AppNavigation.vue'
import PgHeader from '@/components/app/header/PgHeader.vue'
import DefaultFooter from '@/components/app/footer/DefaultFooter.vue'

export default defineComponent({
  middleware: ['utmHandler'],

  components: {
    AppNavigation,
    PgHeader,
    DefaultFooter,
    TrialIsExpiring: () =>
      import('@/components/app/header/TrialIsExpiring.vue'),
    NotificationCard: () =>
      import('@/components/app/notifications/NotificationCard.vue'),
    ShippingAddressModal: () =>
      import('@/components/app/payment/ShippingAddressModal.vue'),
    TrialExpiredModal: () =>
      import('@/components/app/payment/TrialExpiredModal.vue'),
    ContactUsFormModal: () =>
      import('@/components/forms/contact/ContactUsFormModal.vue'),
    NoCreditCardFreeTrialEndedDialog: () =>
      import('@/components/app/NoCreditCardFreeTrialEndedDialog.vue')
  },

  setup() {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const router = useRouter()
    const vuetify = useVuetifyHelper()

    const { isUserLoggedIn, isUserEmailVerified } = useAuth({ store })
    const {
      contentStyle,
      isFullWidth,
      toolbarStyle,
      showContent,
      setShowContent
    } = useLayout({ store, route, vuetify })
    const {
      isTrialExpiringRibbonVisible,
      checkIfShouldShowTrialExpiringRibbon,
      checkIfShouldShowTrialExpiredModal,
      isPreschoolTrialEndedWithNoCreditCardFlowModalVisible,
      checkIfPreschoolTrialEndedWithNoCreditCardFlow
    } = useNotification({ store })

    const routeName = computed(() => route.value.name)

    const hasUserLearnAndPlayPlan = computed(
      () => store.getters['auth/hasUserLearnAndPlayPlan']
    )

    watch(isUserLoggedIn, () => {
      if (isUserLoggedIn.value === true && routeName.value !== 'shared-slug') {
        checkIfShouldShowTrialExpiredModal()
        checkIfShouldShowTrialExpiringRibbon()
      }
    })

    onMounted(() => {
      setShowContent(true)
    })

    const handleExpiredTrialCountdown = () => {
      router.push({ name: 'app-payment-plan' })
    }

    return {
      contentStyle,
      isTrialExpiringRibbonVisible,
      isUserLoggedIn,
      isUserEmailVerified,
      isFullWidth,
      showContent,
      toolbarStyle,
      setShowContent,
      handleExpiredTrialCountdown,
      hasUserLearnAndPlayPlan,
      isPreschoolTrialEndedWithNoCreditCardFlowModalVisible,
      checkIfPreschoolTrialEndedWithNoCreditCardFlow
    }
  }
})
</script>
