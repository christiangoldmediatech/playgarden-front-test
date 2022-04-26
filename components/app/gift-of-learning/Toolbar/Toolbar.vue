<template>
  <v-app-bar
    app
    flat
    height="210px"
    color="transparent"
    :class="[
      'pg-bg-[url(\'@/assets/png/gift-of-learning/top-paper.png\')]',
      'pg-bg-cover',
      'pg-bg-bottom',
    ]"
  >
    <div
      :class="[
        'pg-h-full',
        'pg-w-full',
        'pg-flex',
        'pg-justify-between',
        'pg-relative',
        'pg-max-w-[1150px]',
        'pg-mx-auto'
      ]"
    >
      <!-- COLOR DASHES -->
      <img
        src="@/assets/svg/gift-of-learning/color-dashes.svg"
        class="pg-absolute pg-left-0 pg-right-0 pg-m-auto"
      >

      <!-- LOGO -->
      <img
        src="@/assets/svg/gift-of-learning/playgarden-prep.svg"
        height="110px"
        alt="PlaygardenPrep Logo"
        class="pg-mt-4"
      >

      <div class="pg-flex">
        <!-- INFORMATION AND ACTION BUTTONS -->
        <div class="pg-flex pg-flex-col">
          <!-- CALL NOW -->
          <div class="pg-text-[#707070] pg-mt-10 pg-text-sm pg-mr-">
            <span class="pg-font-bold">Call now</span> to speak with a specialist
            <img src="@/assets/svg/gift-of-learning/phone-call.svg" class="pg-ml-2 pg-mb-[-4px]"> 646 504 4716
          </div>

          <!-- LOGIN, SIGNUP AND LOCATIONS -->
          <div class="pg-flex pg-mt-5">
            <button class="pg-text-base pg-font-bold pg-text-[#707070]">
              Log In
            </button>

            <button
              :class="[
                'pg-text-base',
                'pg-font-bold',
                'pg-text-white',
                'pg-h-9',
                'pg-w-[146px]',
                'pg-ml-12',
                'pg-bg-accent',
                'hover:pg-brightness-110',
              ]"
            >
              SIGN UP
            </button>

            <button class="pg-text-base pg-font-bold pg-text-[#707070] pg-ml-12">
              Locations
            </button>
          </div>
        </div>

        <!-- MENU ICON -->
        <div>
          <img
            src="@/assets/svg/gift-of-learning/hamburger-menu.svg"
            class="pg-ml-10 pg-mt-20 pg-cursor-pointer"
          >
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
