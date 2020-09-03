<template>
  <v-app>
    <!-- APP MAV & BAR -->
    <app-navigation />

    <application-header />

    <!-- CONTENT -->
    <v-main v-if="!fullWidth">
      <v-container fill-height>
        <nuxt />
      </v-container>
    </v-main>

    <nuxt v-else />

    <!-- FOOTER -->
    <default-footer />

    <notify-event />

    <prompt-dialog />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

import AppNavigation from '@/components/app/header/AppNavigation'
import ApplicationHeader from '@/components/app/header/ApplicationHeader'
import DefaultFooter from '@/components/app/footer/DefaultFooter'

export default {
  name: 'Default',

  middleware: ['checkJWT'],

  components: {
    ApplicationHeader,
    AppNavigation,
    DefaultFooter
  },

  computed: {
    ...mapState(['fullWidthPages']),

    fullWidth () {
      return this.fullWidthPages[this.$route.name]
    }
  }
}
</script>

<style lang="scss" scoped>
.v-application ::v-deep {
  .container:not(.container--fluid) {
    max-width: 1200px;
  }
}
</style>
