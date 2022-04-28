<template>
  <v-app-bar
    app
    flat
    height="210px"
    color="transparent"
    :class="[
      'pg-bg-[url(@/assets/png/gift-of-learning/top-paper.png)]',
      'pg-bg-cover',
      'pg-bg-bottom',
    ]"
  >
    <div
      :class="[
        'pg-h-full',
        'pg-w-full',
        'pg-flex',
        'pg-flex-col',
        'pg-max-w-[1150px]',
        'pg-mx-auto',
        'md:pg-flex-row',
        'md:pg-justify-between',
      ]"
    >
      <!-- COLOR DASHES -->
      <img
        src="@/assets/svg/gift-of-learning/top-color-dashes.svg"
        class="pg-absolute pg-left-0 pg-right-0 pg-m-auto pg-w-full md:pg-w-auto"
      >

      <!-- LOGO -->
      <img
        src="@/assets/svg/gift-of-learning/playgarden-prep.svg"
        alt="PlaygardenPrep Logo"
        class="pg-mt-4 pg-h-[72px] md:pg-h-[110px]"
      >

      <div class="pg-relative">
        <div class="pg-flex pg-flex-col md:pg-mr-20">
          <!-- CALL NOW -->
          <div
            :class="[
              'pg-hidden',
              'pg-text-[#707070]',
              'pg-mt-10',
              'pg-text-sm',
              'pg-font-medium',
              'md:pg-inline-block',
            ]"
          >
            <span class="pg-font-bold">Call now</span> to speak with a specialist
            <img src="@/assets/svg/gift-of-learning/phone-call.svg" class="pg-ml-2 pg-mb-[-4px]"> 646 504 4716
          </div>

          <!-- LOGIN, SIGNUP AND LOCATIONS -->
          <div class="pg-flex pg-items-center pg-justify-center pg-mt-5">
            <nuxt-link :to="{ name: 'auth-login' }">
              <button
                :class="[
                  'pg-text-base',
                  'pg-font-semibold',
                  'pg-text-[#707070]',
                  'pg-w-[146px]',
                  'md:pg-w-auto'
                ]"
              >
                Log In
              </button>
            </nuxt-link>

            <nuxt-link :to="{ name: 'auth-parent' }">
              <button
                :class="[
                  'pg-text-base',
                  'pg-font-bold',
                  'pg-text-white',
                  'pg-bg-accent',
                  'pg-h-9',
                  'pg-w-[146px]',
                  'pg-rounded-[4px]',
                  'pg-shadow-[0px_5px_14px_rgba(0,0,0,0.25)]',
                  'hover:pg-brightness-110',
                  'md:pg-shadow-none',
                  'md:pg-ml-12',
                ]"
              >
                SIGN UP
              </button>
            </nuxt-link>

            <button
              :class="[
                'pg-hidden',
                'md:pg-inline-block',
                'pg-text-base',
                'pg-font-semibold',
                'pg-text-[#707070]',
                'pg-ml-12'
              ]"
            >
              Locations
            </button>
          </div>
        </div>

        <!-- MENU ICON -->
        <div>
          <img
            :class="[
              'pg-absolute',
              'pg-cursor-pointer',
              'pg-right-7',
              'pg-top-[-52px]',
              'pg-h-5',
              'md:pg-top-[84px]',
              'md:pg-h-7',
              'md:pg-right-0'
            ]"
            src="@/assets/svg/gift-of-learning/hamburger-menu.svg"
            @click="openDrawer"
          >
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  emits: ['input:open-drawer'],

  setup(_props, { emit }) {
    function openDrawer () {
      emit('input:open-drawer')
    }

    return { openDrawer }
  }
})
</script>
