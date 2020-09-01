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
  *,
  .display-1,
  .display-2,
  .display-3,
  .display-4,
  .headline,
  .title,
  .subtitle-1,
  .subtitle-2,
  .body-1,
  .body-2,
  .caption,
  .overline,
  .text-h1,
  .text-h2,
  .text-h3,
  .text-h4,
  .text-h5,
  .text-h6 {
    font-family: "Poppins", sans-serif !important;
  }

  .container:not(.container--fluid) {
    max-width: 1200px;
  }

  .v-input__control .v-input__slot {
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16) !important;
  }
  .v-label {
    color: rgba(0, 0, 0, 0.16) !important;
  }
}
</style>
