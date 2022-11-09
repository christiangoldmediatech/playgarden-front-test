<template>
  <v-app-bar
    app
    :height="toolbarHeight"
    color="white"
    class="!pg-shadow-[0px_3px_6px_rgba(0,0,0,0.16)]"
  >
    <div
      :class="[
        'pg-h-full',
        'pg-w-full',
        'pg-flex',
        'pg-flex-col',
        'pg-max-w-[1400px]',
        'pg-mx-auto',
        'pg-items-center',
        'lg:pg-flex-row',
        'lg:pg-justify-between',
      ]"
    >
      <!-- LOGO -->
      <img
        src="@/assets/svg/play-learn/play-learn-logo.svg"
        alt="Play & Learn Logo"
        class="pg-h-[48px] lg:pg-h-[64px]"
      >

      <div v-if="isUserLoggedOut" class="pg-relative">
        <div class="pg-flex pg-flex-col pg-mt-4 lg:pg-mt-0">
          <!-- LOGIN, SIGNUP AND LOCATIONS -->
          <div class="pg-flex pg-items-center pg-justify-center">
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
        </div>
      </div>
      <div v-if="isUserLoggedIn" cols="12">
        <v-btn
          block
          class="mb-3"
          color="accent"
          :to="{ name: 'auth-logout' }"
        >
          LOG OUT
        </v-btn>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { useVuetifyHelper } from '@/composables'
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    isUserLoggedIn: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const vuetify = useVuetifyHelper()
    const isMobile = computed(() => vuetify.breakpoint.mdAndDown)
    const isUserLoggedOut = computed(() => !props.isUserLoggedIn)

    const toolbarHeight = computed(() => {
      return props.isUserLoggedIn && isMobile.value
        ? '64px'
        : isMobile.value
          ? '100px'
          : '124px' // desktop
    })

    return {
      isMobile,
      toolbarHeight,
      isUserLoggedOut
    }
  }
})
</script>
