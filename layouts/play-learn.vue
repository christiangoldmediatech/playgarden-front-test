<template>
  <v-app>
    <!-- TOOLBAR -->
    <Toolbar />

    <!-- BODY -->
    <v-main>
      <v-container fluid class="pg-mx-auto pg-max-w-[1400px]">
        <nuxt />
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <Footer />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Footer from '@/components/app/gift-of-learning/Footer/Footer.vue'
import Toolbar from '@/components/app/learn-play/Toolbar/Toolbar.vue'

export default defineComponent({
  name: 'LayoutsPlayLearn',

  middleware: ['utmHandler'],

  components: {
    Toolbar,
    Footer
  },

  setup () {}
})
</script>
