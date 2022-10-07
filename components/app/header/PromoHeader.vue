<template>
  <v-app-bar
    app
    class="pb-4 pg-app-bar paper-bg d-flex justify-center"
    color="transparent"
    flat
    prominent
  >
    <v-row
      class="flex-nowrap header-container"
      align="center"
      justify="space-between"
      no-gutters
    >
      <!-- HAMBURGER MENU -->
      <v-app-bar-nav-icon
        class="pg-app-bar-nav-icon hidden-lg-and-up ham-menu"
        :class="{ 'is-md': isMobile }"
        color="primary"
        tile
        x-large
        @click.stop="toggleDrawer"
      >
        <img width="27" height="27" loading="lazy" src="https://playgardenonline.com/wp-content/uploads/2022/02/bar-menu.svg">
      </v-app-bar-nav-icon>

      <!-- Logo -->
      <v-col class="d-flex align-center logo-container" :class="{ 'is-md': !isMobile }" cols="auto">
        <v-toolbar-title>
          <v-img
            class="cursor-link ml-12"
            alt="Play and Learn Logo"
            max-width="200px"
            :src="require('@/assets/svg/play-learn/play-learn-logo-with-text.svg')"
          />
        </v-toolbar-title>
      </v-col>

      <v-col v-if="!isMobile" class="pg-flex pg-flex-col pg-mt-4 lg:pg-mt-0">
        <!-- LOGIN, SIGNUP AND LOCATIONS -->
        <div class="pg-flex pg-items-center pg-justify-end">
          <nuxt-link :to="{ name: 'auth-play-learn' }">
            <button
              :class="[
                'pg-text-base',
                'pg-font-semibold',
                'pg-text-accent',
                'pg-w-[100px]',
                'lg:pg-w-[146px]',
                'lg:pg-w-auto',
                'lg:pg-text-xl',
              ]"
            >
              REGISTER
            </button>
          </nuxt-link>

          <nuxt-link :to="{ name: 'auth-login' }">
            <button
              :class="[
                'pg-text-base',
                'pg-font-bold',
                'pg-text-white',
                'pg-bg-accent',
                'pg-h-[36px]',
                'pg-w-[100px]',
                'pg-rounded-[4px]',
                'pg-shadow-[0px_3px_6px_rgba(0,0,0,0.16)]',
                'hover:pg-brightness-110',
                'lg:pg-w-[220px]',
                'lg:pg-h-[48px]',
                'lg:pg-text-xl',
                'lg:pg-ml-12',
              ]"
            >
              LOGIN
            </button>
          </nuxt-link>
        </div>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useNuxtHelper, useVuetifyHelper } from '@/composables'

export default defineComponent({
  name: 'PromoHeader',
  setup() {
    const nuxt = useNuxtHelper()
    const vuetify = useVuetifyHelper()

    const isMobile = computed(() => vuetify.breakpoint.mdAndDown)

    const toggleDrawer = () => {
      nuxt.$emit('toggle-promo-nav-drawer')
    }

    return {
      toggleDrawer,
      isMobile
    }
  }
})
</script>

<style lang="scss" scoped>
.pg-app-bar.v-app-bar.v-app-bar--fixed {
  z-index: 1000 !important;
}

.pg-app-bar::v-deep .v-toolbar__content {
  padding: 0;
  width: 100%;
  justify-content: center;
}

.paper-bg {
  background-image: url('~@/assets/webp/paper-header.webp');
  background-size: cover;
  background-position: center bottom;

  @media screen and (max-width: 1201px) {
    background-image: url('~@/assets/webp/paper-header-mobile.webp');
    background-size: cover;
    background-position: center bottom;
  }
}

.pg-app-bar::v-deep.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
  height: 160px !important;
}

@media screen and (max-width: 768px) {
  .pg-app-bar::v-deep.v-sheet.v-app-bar.v-toolbar:not(.v-sheet--outlined) {
    height: 120px !important;
  }
}

.header-container {
  padding: 20px 56px;

  @media (max-width: $breakpoint-md) {
    padding: 28px 32px 28px 0;
  }
}

.logo-container {
  @media (max-width: $breakpoint-md) {
    margin-right: auto;
  }
}

</style>
