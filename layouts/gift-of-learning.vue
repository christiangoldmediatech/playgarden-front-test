<template>
  <v-app>
    <!-- TOOLBAR -->
    <GolToolbar @input:open-drawer="openDrawer" />

    <!-- DRAWER -->
    <GolDrawer v-model="isDrawerOpen" />

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
import { defineComponent, ref } from '@nuxtjs/composition-api'
import GolFooter from '@/components/app/gift-of-learning/Footer/Footer.vue'
import GolToolbar from '@/components/app/gift-of-learning/Toolbar/Toolbar.vue'
import GolDrawer from '@/components/app/gift-of-learning/Drawer/Drawer.vue'

export default defineComponent({
  name: 'LayoutsGiftOfLearning',

  middleware: ['utmHandler'],

  components: {
    GolFooter,
    GolToolbar,
    GolDrawer
  },

  setup () {
    const isDrawerOpen = ref(false)

    function openDrawer () {
      isDrawerOpen.value = true
    }

    return { isDrawerOpen, openDrawer }
  }
})
</script>
