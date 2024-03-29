<template>
  <pg-dialog
    persistent
    :fullscreen="isMobile && fullscreen"
    :value="value"
    max-width="1400px"
    content-class="large-image-content-dialog"
  >
    <!-- CLOSE BUTTON -->
    <div v-if="(isCloseable && !isMobile) || (isCloseable && isMobile && !fullscreen)" class="content-dialog-content">
      <img
        :style="{
          left: isMobile ? '16px' : undefined,
          right: isMobile ? undefined : '16px'
        }"
        src="@/assets/svg/close-icon.svg"
        alt="close-icon"
        width="22px"
        class="close-dialog-icon"
        data-test-id="close-button"
        @click="$emit('close')"
      >
    </div>

    <v-card :class="cardClasses">
      <!-- HORIZONTAL PROGRESS -->
      <v-progress-linear :active="loading" indeterminate height="12px" data-test-id="progress-linear" />

      <div class="d-flex">
        <!-- IMAGE -->
        <div class="d-none d-md-flex" :style="`width: ${imageWidth}%;`">
          <v-img
            :src="img"
            :height="imageHeight"
            cover
            data-test-id="image"
            class="!rounded-[16px]"
          />
        </div>

        <!-- CONTENT -->
        <div class="my-6 my-md-14 px-8" :style="`width: ${isMobile ? '100%' : (100 - imageWidth) + '%'}`">
          <v-btn v-if="isCloseable && fullscreen" class="d-md-none warning--text mb-4 pl-0" text data-test-id="mobile-close-button" @click="$emit('close')">
            <v-icon left>
              mdi-arrow-left
            </v-icon>
            Back
          </v-btn>

          <slot name="default" />
        </div>
      </div>
    </v-card>
  </pg-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LargeImageContentDialog',

  props: {
    value: {
      type: Boolean,
      default: false
    },

    img: {
      type: String,
      default: ''
    },

    isCloseable: {
      type: Boolean,
      default: true
    },

    loading: {
      type: Boolean,
      default: false
    },

    imageHeight: {
      type: String,
      default: '100%'
    },

    fullscreen: {
      type: Boolean,
      default: true
    },

    imageWidth: {
      type: Number,
      default: 30
    }
  },

  computed: {
    isMobile (): boolean {
      return this.$vuetify.breakpoint.mobile
    },

    cardClasses (): Record<string, boolean> {
      return {
        'elevation-0 !rounded-[16px]': true
      }
    }
  }
})
</script>

<style lang="scss">
.large-image-content-dialog {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  box-shadow: none;

  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.large-image-content-dialog::-webkit-scrollbar {
  display: none;
}

.content-dialog-content {
  position: relative;
  cursor: pointer;
  width: 100%;
  height: 36px;
}

.close-dialog-icon {
  position: absolute;
}

.\!rounded-\[16px\] {
  border-radius: 16px !important;
}
</style>
