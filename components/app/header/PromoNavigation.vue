<template>
  <v-navigation-drawer v-model="appDrawer" temporary app width="100%">
    <v-container class="fill-height">
      <div class="pg-w-full pg-flex pg-px-5 pg-pt-3 pg-mb-auto pg-justify-between pg-items-center">
        <!-- Logo -->
        <v-img
          alt="Play and Learn Logo"
          max-width="100"
          :src="require('@/assets/svg/play-learn/play-learn-logo-with-text.svg')"
        />

        <!-- Close button -->
        <v-btn icon large @click.stop="appDrawer = !appDrawer">
          <v-icon large color="primary">
            mdi-close
          </v-icon>
        </v-btn>
      </div>

      <div class="pg-w-full pg-flex pg-flex-col pg-mt-auto pg-items-center">
        <nuxt-link :to="{ name: 'auth-play-learn' }" class="pg-mb-2">
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

        <nuxt-link :to="{ name: 'auth-login' }" class="pg-w-full">
          <button
            :class="[
              'pg-text-base',
              'pg-font-bold',
              'pg-text-white',
              'pg-bg-accent',
              'pg-h-[36px]',
              'pg-w-full',
              'pg-rounded-[4px]',
              'pg-shadow-[0px_3px_6px_rgba(0,0,0,0.16)]',
              'hover:pg-brightness-110',
              'lg:pg-w-full',
              'lg:pg-h-[48px]',
              'lg:pg-text-xl',
              'lg:pg-ml-12',
            ]"
          >
            LOGIN
          </button>
        </nuxt-link>
      </div>
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { useNuxtHelper } from '@/composables'

export default defineComponent({
  name: 'PromoNavigation',
  setup() {
    const nuxt = useNuxtHelper()
    const appDrawer = ref(false)

    onMounted(() => {
      nuxt.$on('toggle-promo-nav-drawer', () => {
        appDrawer.value = !appDrawer.value
      })
    })

    return {
      appDrawer
    }
  }
})
</script>

<style lang="scss" scoped>
.v-navigation-drawer--temporary {
  z-index: 1500;
}

</style>
