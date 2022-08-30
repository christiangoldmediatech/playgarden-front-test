<template>
  <v-app>
    <!-- TOOLBAR -->
    <Toolbar :is-user-logged-in="isUserLoggedIn" />

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
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import Footer from '@/components/app/footer/DefaultFooter.vue'
import Toolbar from '@/components/app/learn-play/Toolbar/Toolbar.vue'
import { TypedStore } from '@/models'
import { useAuth } from '@/composables'

export default defineComponent({
  name: 'LayoutsPlayLearn',

  middleware: ['utmHandler'],

  components: {
    Toolbar,
    Footer,
    EmailConflictModal: () => import('@/components/app/register/EmailConflictModal.vue'),
    AccountInactiveModal: () => import('@/components/app/register/AccountInactiveModal.vue')
  },

  setup () {
    const store = useStore<TypedStore>()
    const Auth = useAuth({ store })

    return {
      isUserLoggedIn: Auth.isUserLoggedIn
    }
  }
})
</script>
