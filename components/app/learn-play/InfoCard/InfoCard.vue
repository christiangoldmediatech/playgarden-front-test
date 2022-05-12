<template>
  <div>
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-py-6',
        'pg-px-14',
        'pg-text-center',
        'pg-shadow-[0px_8px_24px_rgba(0,0,0,0.15)]',
        'pg-h-[500px]',
        'pg-w-[580px]',
        'pg-rounded-lg',
        'pg-bg-white'
      ]"
    >
      <!-- TITLE -->
      <div>
        <underlined-title text="Play and Learn for family fun and well-being!" font-size="28px" />
      </div>

      <!-- CONTENT -->
      <div class="pg-text-xl pg-text-black pg-mt-4">
        Start learning together now, cancel any time!
      </div>

      <div
        :class="[
          'pg-relative',
          'pg-w-full',
          'pg-flex',
          'pg-justify-center'
        ]"
      >
        <img
          src="@/assets/png/play-learn/acuarela-activity.png"
          class="pg-mt-10 pg-z-10"
        >

        <img
          src="@/assets/png/play-learn/acuarela-green.png"
          class="pg-absolute pg-top-[-16px] pg-left-0 pg-right-0"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'InfoCard'
})
</script>
