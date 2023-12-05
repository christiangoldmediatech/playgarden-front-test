<template>
  <div
    id="horizontal-card-ribbon"
    :class="[
      'pg-transition pg-duration-200',
      'pg-fixed pg-top-14 md:pg-top-20 pg-z-50 pg-w-full',
      'pg-bg-white pg-shadow-toolbar',
      !$vuetify.breakpoint.smAndDown ? 'pg-rounded-b-[10px]' : 'pg-rounded-b-[40px]'
    ]"
  >
    <v-row no-gutters>
      <v-col cols="12" class="pb-5" :class="[ !$vuetify.breakpoint.smAndDown ? 'pg-rounded-b-[40px] pg-shadow-[0px_8px_24px_rgba(0,0,0,0.1)]' : '' ]">
        <slot name="fixed"></slot>
      </v-col>
      <v-col cols="12">
        <v-expand-transition>
          <div v-show="!isMinimized" data-test-id="hcr-content">
            <slot name="expandable" />
          </div>
        </v-expand-transition>
      </v-col>
      <v-col
        cols="12"
        class="pg-cursor-pointer pg-text-center pg-my-3 md:pg-my-2"
        data-test-id="hcr-minimize-button"
        @click="$emit('update:isMinimized', !isMinimized)"
      >
        <v-icon color="#F89838" large>
          {{ isMinimized ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
        </v-icon>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    isMinimized: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentScroll: 0
    }
  },

  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('scroll', this.toggleHorizontalCard)
  },

  destroyed() {
    window.removeEventListener('scroll', this.toggleHorizontalCard)
  },

  methods: {
    toggleHorizontalCard() {
      const horizontalCard: any = document.getElementById('horizontal-card-ribbon')
      const scroll = window.scrollY

      if (horizontalCard) {
        if (scroll > 80 && scroll > this.currentScroll) {
          this.$emit('update:isMinimized', true)
          this.currentScroll = scroll
        } else if (scroll < this.currentScroll) {
          this.$emit('update:isMinimized', false)
          this.currentScroll = scroll
        }
      }
    }
  }
})
</script>
