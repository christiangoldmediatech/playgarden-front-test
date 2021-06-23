<template>
  <div class="horizontal-card">
    <v-row no-gutters>
      <v-col cols="12">
        <v-expand-transition class="elevation-0">
          <div v-show="!isMinimized" data-test-id="hcr-content">
            <slot />
          </div>
        </v-expand-transition>
      </v-col>
      <v-col
        cols="12"
        class="action text-center my-3"
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

<style lang="scss" scoped>
.horizontal-card {
  transition: 0.2s;
  position: fixed;
  top: 64px;
  z-index: 50;
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0px 0px 40px 40px;

  & .action {
    cursor: pointer;
  }
}

@media (max-width: $breakpoint-sm) {
  .horizontal-card {
    top: 54px;
  }
}
</style>
