<template>
  <v-app>
    <template v-if="showContent">
      <!-- APP HEADER -->
      <pg-header-birthday />
      <!-- CONTENT -->
      <v-main v-if="!isFullWidth">
        <v-container class="pa-md-3 pa-0" fill-height :style="contentStyle">
          <nuxt />
        </v-container>
      </v-main>
      <nuxt v-else :style="contentStyle" />
      <!-- FOOTER -->
      <default-footer />
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
import { useLayout, useNotification, useVuetifyHelper } from '@/composables'
import { TypedStore } from '@/models'
import { useRoute, useStore } from '@nuxtjs/composition-api'
import { defineComponent, onMounted } from '@vue/composition-api'

import AppNavigation from '@/components/app/header/AppNavigation.vue'
import PgHeaderBirthday from '@/components/app/header/PgHeaderBirthday.vue'
import DefaultFooter from '@/components/app/footer/DefaultFooter.vue'

export default defineComponent({
  middleware: ['utmHandler'],

  components: {
    AppNavigation,
    PgHeaderBirthday,
    DefaultFooter
  },

  setup () {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const vuetify = useVuetifyHelper()

    const {
      contentStyle,
      isFullWidth,
      showContent,
      setShowContent
    } = useLayout({ store, route, vuetify })
    const {
      isTrialExpiringRibbonVisible
    } = useNotification({ store })

    onMounted(() => {
      setShowContent(true)
    })

    return {
      contentStyle,
      isTrialExpiringRibbonVisible,
      isFullWidth,
      showContent,
      setShowContent
    }
  }
})
</script>
