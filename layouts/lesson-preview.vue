<template>
  <v-app>
    <!-- APP MAV & BAR -->
    <app-navigation />
    <application-header full-width preview-mode />
    <!-- CONTENT -->
    <nuxt />
    <!-- FOOTER -->
    <default-footer />
    <notify-event />
    <coming-soon-dialog :showing="isComingSoonDialogOpen" />
  </v-app>
</template>

<script>
import AppNavigation from '@/components/app/header/AppNavigation'
import ApplicationHeader from '@/components/app/header/ApplicationHeader'
import DefaultFooter from '@/components/app/footer/DefaultFooter'
import ComingSoonDialog from '@/components/app/ComingSoonDialog'

import ComingSoonRoutes from '@/utils/consts/comingSoonRoutes'

export default {
  name: 'LessonPreview',

  middleware: ['checkJWT'],

  components: {
    ApplicationHeader,
    AppNavigation,
    DefaultFooter,
    ComingSoonDialog
  },

  computed: {
    isComingSoonDialogOpen () {
      if (['production'].includes(process.env.testEnv)) {
        const routes = ComingSoonRoutes
        return Boolean(routes[this.$route.name])
      }
      return false
    }
  }
}
</script>
