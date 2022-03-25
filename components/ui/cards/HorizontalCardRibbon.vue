<template>
  <div
    id="horizontal-card-ribbon"
    :class="[
      'pg-transition pg-duration-200',
      'pg-fixed pg-top-14 md:pg-top-24 pg-z-50 pg-w-full',
      'pg-bg-white pg-shadow-toolbar pg-rounded-b-[40px]'
    ]"
  >
    <v-row no-gutters>
      <v-col cols="12">
        <v-expand-transition>
          <div v-show="!isMinimized" data-test-id="hcr-content">
            <slot />
          </div>
        </v-expand-transition>
      </v-col>
      <v-col
        cols="12"
        class="pg-cursor-pointer pg-text-center pg-my-3 md:pg-my-2"
        data-test-id="hcr-minimize-button"
        @click="$emit('update:isMinimized', !isMinimized)"
      >
        <v-icon>{{ isMinimized ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
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
      if (this.$vuetify.breakpoint.mdAndDown && horizontalCard) {
        const scroll = window.scrollY
        if (scroll > this.currentScroll) {
          horizontalCard.style.top = '0rem'
          this.currentScroll = scroll
        } else if (scroll < this.currentScroll) {
          horizontalCard.style.top = null
          this.currentScroll = scroll
        }
      } else {
        horizontalCard.style.top = null
      }
    }
  }
})
</script>
