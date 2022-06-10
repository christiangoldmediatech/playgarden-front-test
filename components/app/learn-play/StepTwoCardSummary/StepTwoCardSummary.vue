<template>
  <div>
    <div
      :class="[
        'pg-relative',
        'pg-transition-shadow',
        'pg-flex',
        'pg-flex-col',
        'pg-py-6',
        'pg-px-8',
        'pg-text-center',
        'pg-rounded-lg',
        'pg-bg-white',
        'pg-max-w-[500px]',
        'lg:pg-px-10',
        'lg:pg-w-[500px]',
        {
          'pg-shadow-[0px_8px_24px_rgba(0,0,0,0.15)]': isOpen,
        }
      ]"
    >
      <!-- ARROW -->
      <div class="pg-absolute pg-right-4 pg-top-4">
        <v-btn icon @click="$emit('input', !value)">
          <v-icon size="42">
            {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </v-btn>
      </div>

      <!-- TITLE -->
      <div class="pg-text-center">
        <div class="pg-text-lg lg:pg-text-2xl pg-font-bold pg-text-pg-grey pg-opacity-80">
          Our family loves
        </div>

        <img src="@/assets/svg/play-learn/play-learn-logo.svg" class="pg-h-10 lg:pg-h-[56px] pg-mt-2">
      </div>

      <div
        :class="[
          'pg-transition-[max-height]',
          'pg-overflow-hidden',
          'pg-duration-500',
          {
            'pg-max-h-screen': isOpen,
            'pg-max-h-0': isClose,
          }
        ]"
        class="pg-text-center"
      >
        <div class="pg-text-base pg-mt-6">
          Still not sure? Call us, text us, email us, we'll be happy to explain our program in more detail!
        </div>

        <img src="@/assets/png/play-learn/teacher-orange-splash.png" class="pg-h-[150px] pg-mt-7">

        <div class="pg-mt-4">
          <img src="@/assets/svg/play-learn/orange-phone.svg" class="pg-h-6 lg:pg-h-[30px] pg-mb-[-6px]">
          <a href="tel:646-504-4716">
            <span class="pg-text-lg lg:pg-text-2xl pg-font-semibold !pg-text-pg-grey">646-504-4716</span>
          </a>
        </div>

        <div class="pg-mt-4">
          <a href="mailto:hello@playgardenprep.com">
            <span class="pg-text-base !pg-text-pg-grey">hello@playgardenprep.com</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'StepTwoCardSummary',

  props: {
    value: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    const isOpen = computed(() => props.value)
    const isClose = computed(() => !props.value)

    return {
      isOpen,
      isClose
    }
  }
})
</script>
