<template>
  <v-footer
    :class="[
      'pg-bg-[url(@/assets/png/gift-of-learning/bottom-paper.png)]',
      'pg-bg-cover',
      'pg-bg-top',
    ]"
    app
    absolute
    color="transparent"
  >
    <div
      :class="[
        'pg-grid',
        'pg-grid-cols-1',
        'md:pg-grid-cols-6',
        'pg-max-w-[1150px]',
        'pg-mx-auto'
      ]"
    >
      <!-- LOGO -->
      <div class="pg-flex pg-justify-center pg-items-center">
        <img src="@/assets/svg/gift-of-learning/playgarden-prep.svg" class="pg-h-[180px]">
      </div>

      <!-- LINKS -->
      <div class="pg-grid pg-grid-cols-1 pg-gap-2">
        <a v-for="link in links" :key="link.name" :href="link.href">
          <span class="pg-inline-block pg-text-lg pg-text-[#606060]">{{ link.name }}</span>
        </a>
      </div>

      <!-- ONLINE SCHOOL -->
      <div class="pg-grid pg-grid-cols-1">
        <div>Online School</div>

        <a href="mailto:hello@playgardenprep.com">
          hello@playgardenprep.com
        </a>

        646-504-4716
      </div>
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
