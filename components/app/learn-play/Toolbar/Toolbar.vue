<template>
  <v-app-bar
    app
    height="118px"
    color="white"
    class="!pg-shadow-[0px_3px_6px_rgba(0,0,0,0.16)]"
  >
    <div
      :class="[
        'pg-h-full',
        'pg-w-full',
        'pg-flex',
        'pg-flex-col',
        'pg-max-w-[1150px]',
        'pg-mx-auto',
        'pg-items-center',
        'md:pg-flex-row',
        'md:pg-justify-between',
      ]"
    >
      <!-- LOGO -->
      <img
        src="@/assets/svg/play-learn/play-learn-logo.svg"
        alt="Play & Learn Logo"
        class="pg-h-[72px]"
      >

      <div class="pg-relative">
        <div class="pg-flex pg-flex-col">
          <!-- LOGIN, SIGNUP AND LOCATIONS -->
          <div class="pg-flex pg-items-center pg-justify-center">
            <nuxt-link :to="{ name: 'auth-parent' }">
              <button
                :class="[
                  'pg-text-2xl',
                  'pg-font-semibold',
                  'pg-text-accent',
                  'pg-w-[146px]',
                  'md:pg-w-auto'
                ]"
              >
                REGISTER
              </button>
            </nuxt-link>

            <nuxt-link :to="{ name: 'auth-login' }">
              <button
                :class="[
                  'pg-text-2xl',
                  'pg-font-bold',
                  'pg-text-white',
                  'pg-bg-accent',
                  'pg-h-[60px]',
                  'pg-w-[250px]',
                  'pg-rounded-[4px]',
                  'pg-shadow-[0px_3px_6px_rgba(0,0,0,0.16)]',
                  'hover:pg-brightness-110',
                  'md:pg-ml-12',
                ]"
              >
                LOGIN
              </button>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {}
})
</script>
