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
        <UnderlinedTitle
          font-size="26px"
          font-size-mobile="20px"
          text="Our family loves Playgarden Prep Online!"
        />
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
        <p class="pg-text-center pg-mt-5">
          Still not sure? Call us, text us, email us, We'll be happy to explain
          our program in more detail
        </p>

        <img
          src="@/assets/png/Miss Sarah.png"
          alt="Miss Sarah"
          class="pg-block pg-mx-auto pg-w-[150px] pg-mt-5 pg-rounded-[50%]"
        >

        <div class="pg-text-center pg-mt-5">
          <span>
            Miss Sarah
          </span>
          <br>
          <a class="blue--text" href="tel:646-504-4716">646-504-4716 </a>
          <br>
          <a
            class="black--text"
            href="mailto:hello@playgardenprep.com"
          >hello@playgardenprep.com</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CardPlaygarden',

  props: {
    value: {
      type: Boolean,
      default: true
    },

    isUserInactive: {
      type: Boolean,
      default: false
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
