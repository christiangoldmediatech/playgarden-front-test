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
  </v-app>
</template>

<script>
import AppNavigation from '@/components/app/header/AppNavigation'
import ApplicationHeader from '@/components/app/header/ApplicationHeader'
import DefaultFooter from '@/components/app/footer/DefaultFooter'

export default {
  name: 'LessonPreview',

  middleware: ['checkJWT'],

  components: {
    ApplicationHeader,
    AppNavigation,
    DefaultFooter
  }
}
</script>
