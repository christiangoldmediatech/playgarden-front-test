<template>
  <v-app>
    <!-- TOOLBAR -->
    <GolToolbar />

    <!-- DRAWER -->
    <GolDrawer />

    <!-- BODY -->
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <GolFooter />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import GolFooter from '@/components/app/gift-of-learning/Footer/Footer.vue'
import GolToolbar from '@/components/app/gift-of-learning/Toolbar/Toolbar.vue'
import GolDrawer from '@/components/app/gift-of-learning/Drawer/Drawer.vue'

export default defineComponent({
  middleware: ['utmHandler'],

  components: {
    GolFooter,
    GolToolbar,
    GolDrawer
  },

  setup () {}
})
</script>
