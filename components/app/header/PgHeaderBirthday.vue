<template>
  <v-app-bar flat :height="appBarHeight" class="pg-header" app>
    <v-row no-gutters>
      <!-- Children Select  -->
      <v-col cols="12" md="3" order="2" order-md="1" class="d-flex align-center justify-center mt-3 mt-md-0">
        <v-btn
          class="btn"
          to="/"
          color="warning"
          dark
        >
          Go to Playgarden Prep Online
        </v-btn>
      </v-col>

      <v-col cols="12" md="6" order="1" order-md="2" class="d-flex flex-column justify-center align-center">
        <v-row no-gutters class="text-center">
          <!-- PlaygardenPrep Logo -->
          <v-col cols="12">
            <img
              alt="Playarden Prep Online Logo"
              :height="appBarLogoSize"
              :src="require('@/assets/svg/logo.svg')"
            >
          </v-col>

          <!-- Toolbar Title -->
          <v-col cols="12">
            <underlined-title :text="`Happy Birthday ${childName}!`" :font-size="appBarTitleSize" :font-size-mobile="appBarTitleSize" />
          </v-col>
        </v-row>
      </v-col>

      <v-col md="3" order="3" class="d-none d-md-flex justify-end align-center" />
    </v-row>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, computed, useRoute } from '@nuxtjs/composition-api'

import { useNuxtHelper, useVuetifyHelper } from '@/composables'

export default defineComponent({
  components: {
  },

  setup () {
    const route = useRoute()
    const vuetify = useVuetifyHelper()
    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const appBarHeight = computed(() => isMobile.value ? '220px' : '175px')
    const appBarTitleSize = computed(() => isMobile.value ? '28px' : '60px')
    const appBarLogoSize = computed(() => isMobile.value ? '25px' : '45px')
    const nuxt = useNuxtHelper()
    const handleSidebarToggle = () => {
      nuxt.$emit('toggle-nav-drawer')
    }

    const childName = computed(() => route.value.params.name)

    return {
      isMobile,
      appBarTitleSize,
      appBarLogoSize,
      appBarHeight,
      handleSidebarToggle,
      childName
    }
  }
})
</script>

<style lang="scss" scoped>
.pg-header {
  background: #FFFFFF !important;
  box-shadow: 0px 3px 46px rgba(0, 0, 0, 0.160784) !important;
  border-radius: 0px 0px 36px 36px !important;

  &-menu-btn {
    position: absolute;
    top: 5px;
    left: 5px;
  }
}
.btn {
  text-transform: unset !important;
}
</style>
