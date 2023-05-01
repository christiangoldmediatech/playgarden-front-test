<template>
  <v-app>
    <!-- TOOLBAR -->
    <Toolbar v-if="!isLoginPromoPage" :is-user-logged-in="isUserLoggedIn" />
    <promo-header v-else />
    <promo-navigation />
    <finish-no-credit-card-flow />

    <!-- BODY -->
    <v-main>
      <nuxt />
    </v-main>

    <!-- MODALS -->
    <EmailConflictModal />
    <AccountInactiveModal />

    <!-- FOOTER -->
    <Footer />
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  useRoute,
  computed
} from '@nuxtjs/composition-api'
import Footer from '@/components/app/footer/DefaultFooter.vue'
import Toolbar from '@/components/app/learn-play/Toolbar/Toolbar.vue'
import PromoHeader from '@/components/app/header/PromoHeader.vue'
import PromoNavigation from '@/components/app/header/PromoNavigation.vue'
import { TypedStore } from '@/models'
import { useAuth } from '@/composables'
import FinishNoCreditCardFlow from '@/components/app/payment/FinishNoCreditCardFlow.vue'

export default defineComponent({
  name: 'LayoutsPlayLearn',

  middleware: ['utmHandler'],

  components: {
    FinishNoCreditCardFlow,
    Toolbar,
    Footer,
    PromoHeader,
    PromoNavigation,
    EmailConflictModal: () =>
      import('@/components/app/register/EmailConflictModal.vue'),
    AccountInactiveModal: () =>
      import('@/components/app/register/AccountInactiveModal.vue')
  },

  setup() {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const Auth = useAuth({ store })

    const isLoginPromoPage = computed(
      () => route.value.name === 'auth-play-learn-promo'
    )

    return {
      isUserLoggedIn: Auth.isUserLoggedIn,
      isLoginPromoPage
    }
  }
})
</script>
