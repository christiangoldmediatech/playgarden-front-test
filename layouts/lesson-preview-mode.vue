<template>
  <v-app>
    <v-app-bar app height="98">
      <v-toolbar-title class="mx-3">
        <v-img
          class="mx-4 cursor-link"
          :class="{ 'mt-8': $vuetify.breakpoint.mdAndUp }"
          alt="Playarden Prep Online Logo"
          max-height="100"
          :max-width="$vuetify.breakpoint.mdAndUp ? 290 : 200"
          :src="require('@/assets/svg/logo.svg')"
        />
        <!-- </nuxt-link> -->
      </v-toolbar-title>
    </v-app-bar>
    <!-- CONTENT -->
    <nuxt />

    <!-- FOOTER -->
    <default-footer />
  </v-app>
</template>

<script>
import DefaultFooter from '@/components/app/footer/DefaultFooter'

export default {
  name: 'LessonPreviewMode',
  components: {
    DefaultFooter
  }
}
</script>
