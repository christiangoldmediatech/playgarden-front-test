<template>
  <v-app class="pg-app">
    <!-- APP BAR -->
    <application-header />

    <!-- CONTENT -->
    <v-main>
      <v-container class="fill-height" fluid mt-6 mt-md-0 pa-0>
        <nuxt />
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <default-footer class="mt-12" />

    <notify-event />
  </v-app>
</template>

<script>
import ApplicationHeader from '@/components/app/menu/ApplicationHeader'
import DefaultFooter from '@/components/app/DefaultFooter'

export default {
  name: 'Default',

  middleware: ['checkJWT'],

  components: {
    ApplicationHeader,
    DefaultFooter
  }
}
</script>
