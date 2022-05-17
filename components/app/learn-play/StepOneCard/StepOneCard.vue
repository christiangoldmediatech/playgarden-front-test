<template>
  <div>
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-py-6',
        'pg-px-8',
        'pg-text-center',
        'pg-shadow-[0px_8px_24px_rgba(0,0,0,0.15)]',
        'pg-rounded-lg',
        'pg-bg-white',
        'pg-max-w-[500px]',
        'lg:pg-px-10',
        'lg:pg-w-[500px]',
        'lg:pg-h-[500px]',
      ]"
    >
      <!-- TITLE -->
      <div>
        <underlined-title
          text="Play and Learn for family fun and well-being!"
          font-size="28px"
          font-size-mobile="24px"
        />
      </div>

      <!-- CONTENT -->
      <div class="pg-text-base lg:pg-text-xl pg-text-black pg-mt-4">
        Start learning together now, cancel any time!
      </div>

      <!-- IMAGE -->
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
          class="pg-mt-8 lg:pg-mt-10 pg-z-[4] pg-h-[150px] lg:pg-h-[250px]"
        >

        <img
          :class="[
            'pg-absolute',
            'pg-left-0',
            'pg-right-0',
            'pg-top-0',
            'pg-mx-auto',
            'pg-h-[200px]',
            'lg:pg-h-[350px]'
          ]"
          src="@/assets/png/play-learn/acuarela-green.png"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'StepOneCard'
})
</script>
