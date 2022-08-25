<template>
  <v-app>
    <!-- NAVIGATION -->
    <ApplicationHeader />
    <AppNavigation />

    <!-- BODY -->
    <v-main>
      <nuxt />
    </v-main>

    <!-- MODALS -->
    <EmailConflictModal />
    <AccountInactiveModal />

    <!-- FOOTER -->
    <DefaultFooter />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import ApplicationHeader from '@/components/app/header/ApplicationHeader.vue'
import AppNavigation from '@/components/app/header/AppNavigation.vue'
import DefaultFooter from '@/components/app/footer/DefaultFooter.vue'
import EmailConflictModal from '@/components/app/register/EmailConflictModal.vue'
import AccountInactiveModal from '@/components/app/register/AccountInactiveModal.vue'
import { useAuth } from '@/composables/users'

export default defineComponent({
  name: 'LayoutsSignup',

  middleware: ['utmHandler'],

  components: {
    ApplicationHeader,
    AppNavigation,
    DefaultFooter,
    EmailConflictModal,
    AccountInactiveModal
  },

  setup() {
    const Auth = useAuth()

    return {
      isUserLoggedIn: Auth.isUserLoggedIn
    }
  }
})
</script>
