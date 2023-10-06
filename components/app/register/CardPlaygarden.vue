<template>
  <div class="w-100">
    <div
      :class="[
        'pg-relative',
        'pg-transition-shadow',
        'pg-flex',
        'pg-flex-col',
        'pg-py-6',
        'pg-px-2',
        'sm:pg-px-8',
        'pg-text-center',
        'pg-rounded-lg',
        'pg-bg-white',
        'pg-max-w-[100%]',
        'sm:pg-max-w-[500px]',
        'pg-w-[100%]',
        'sm:pg-w-[500px]',
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
      <slot name="title">
        <div class="pg-text-center">
          <UnderlinedTitle
            font-size="26px"
            font-size-mobile="20px"
            text="Our family loves Playgarden Prep Online!"
          />
        </div>
      </slot>

      <slot name="testimonials" />

      <div
        :class="[
          'pg-transition-[max-height]',
          'pg-overflow-hidden',
          'pg-duration-500',
          'pg-w-100',
          {
            'pg-max-h-screen': isOpen,
            'pg-max-h-0': isClose,
          }
        ]"
        class="pg-text-center"
      >
        <p class="pg-text-center pg-mt-5">
          {{ $t('payment.card.subtitle') }}
        </p>

        <div class="pg-flex pg-items-center pg-justify-between pg-w-100">
          <v-img
            :src="require('@/assets/png/miss_rose.png')"
            alt="Miss Rose"
            class="pg-block pg-mt-5 pg-rounded-[50%]"
            :width="$vuetify.breakpoint.xs ? 120 : 200"
            :height="$vuetify.breakpoint.xs ? 120 : 200"
            contain
          />
          <div class="pg-mt-5" :style="{ 'width': $vuetify.breakpoint.xs ? 'calc(100% - 120px)' : '100%' }">
            <p class="!pg-mb-2">
              <strong>
                {{ $t('payment.card.teacherTitle') }}
              </strong>
            </p>
            <p class="!pg-mb-2">
              <a class="blue--text" href="tel:646-504-4716">
                {{ $t('payment.card.phone') }} </a>
            </p>
            <a
              class="black--text"
              href="mailto:hello@playgardenprep.com"
            >
              hello@playgardenprep.com
            </a>
          </div>
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
