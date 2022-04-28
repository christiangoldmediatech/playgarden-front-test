<template>
  <v-footer
    :class="[
      'pg-bg-[url(@/assets/png/gift-of-learning/bottom-paper.png)]',
      'pg-bg-cover',
      'pg-bg-[center_top_-2rem]',
      'md:pg-bg-top',
    ]"
    app
    absolute
    color="transparent"
  >
    <div class="pg-flex pg-flex-col pg-w-full pg-relative">
      <div
        :class="[
          'pg-w-full',
          'pg-flex',
          'pg-flex-col',
          'pg-justify-between',
          'pg-max-w-[1150px]',
          'pg-mt-48',
          'pg-mx-auto',
          'md:pg-mt-36',
          'md:pg-flex-row',
        ]"
      >
        <!-- LOGO -->
        <div class="pg-flex pg-justify-center pg-items-center">
          <img src="@/assets/svg/gift-of-learning/playgarden-prep.svg" class="pg-h-[180px]">
        </div>

        <!-- LINKS -->
        <div class="pg-grid pg-grid-cols-1 pg-gap-2 md:pg-gap-0 pg-text-center pg-mt-12 md:pg-mt-0">
          <a v-for="link in links" :key="link.name" :href="link.href">
            <span class="pg-inline-block pg-text-lg pg-text-[#606060] pg-font-medium">{{ link.name }}</span>
          </a>
        </div>

        <!-- ONLINE SCHOOL -->
        <div class="pg-grid pg-grid-cols-1 pg-gap-2 md:pg-gap-0 pg-text-center pg-mt-12 md:pg-mt-0">
          <div class="pg-text-2xl pg-leading-9 pg-text-[#68C453] pg-font-semibold">
            Online School
          </div>

          <a href="mailto:hello@playgardenprep.com" class="pg-font-medium">
            hello@playgardenprep.com
          </a>

          <a href="tel:646-504-4716" class="pg-font-medium">
            <div>646-504-4716</div>
          </a>

          <div class="pg-font-medium pg-text-[#606060]">
            95 Franklin Street
          </div>

          <div class="pg-font-medium pg-text-[#606060]">
            New York, NY 10013
          </div>
        </div>

        <!-- UPPER EAST SIDE -->
        <div class="pg-grid pg-grid-cols-1 pg-gap-2 md:pg-gap-0 pg-text-center pg-mt-12 md:pg-mt-0">
          <div class="pg-text-2xl pg-leading-9 pg-text-[#68C453] pg-font-semibold">
            Upper East Side
          </div>

          <a href="mailto:ues@playgardenprep.com" class="pg-font-medium">
            ues@playgardenprep.com
          </a>

          <a href="tel:212-965-9718" class="pg-font-medium">
            <div>212-965-9718</div>
          </a>

          <div class="pg-font-medium pg-text-[#606060]">
            1366 Madison Avenue
          </div>

          <div class="pg-font-medium pg-text-[#606060]">
            New York, NY 10128
          </div>
        </div>

        <!-- TRIBECA -->
        <div class="pg-grid pg-grid-cols-1 pg-gap-2 md:pg-gap-0 pg-text-center pg-mt-12 md:pg-mt-0">
          <div class="pg-text-2xl pg-leading-9 pg-text-[#68C453] pg-font-semibold">
            Tribeca
          </div>

          <a href="mailto:tribeca@playgardenprep.com" class="pg-font-medium">
            tribeca@playgardenprep.com
          </a>

          <a href="tel:212-965-9717" class="pg-font-medium">
            <div>212-965-9717</div>
          </a>

          <div class="pg-font-medium pg-text-[#606060]">
            95 Franklin Street
          </div>

          <div class="pg-font-medium pg-text-[#606060]">
            New York, NY 10013
          </div>
        </div>
      </div>

      <!-- DASHED LINE -->
      <div class="pg-border-0 pg-border-b-[0.5px] pg-border-[#606060] pg-border-dashed pg-my-7" />

      <!-- COPYRIGHT -->
      <div class="pg-text-center pg-text-xs pg-text-[#606060] pg-mb-10">
        2020 - {{ new Date().getFullYear() }} © Playgarden Prep. All rights reserved.
      </div>

      <!-- COLOR DASHES -->
      <img
        src="@/assets/svg/gift-of-learning/bottom-color-dashes.svg"
        class="pg-absolute pg-bottom-0 pg-left-0 pg-right-0 pg-mx-auto pg-w-full md:pg-w-auto"
      >
    </div>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const links = ref<{ name: string, href: string }[]>([
      { name: 'Playgarden Prep', href: '#' },
      { name: 'Preschool', href: '#' },
      { name: 'Terms of Use', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Help', href: '#' }
    ])

    return { links }
  }
})
</script>
