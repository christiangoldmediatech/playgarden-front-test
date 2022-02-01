<template>
  <div
    :class="[
      'pg-transition pg-duration-200',
      'pg-fixed pg-top-14 md:pg-top-16 pg-z-50 pg-w-full',
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
        class="pg-cursor-pointer pg-text-center pg-my-3"
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
  }
})
</script>
