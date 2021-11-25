<template>
  <pg-dialog
    persistent
    :fullscreen="isMobile"
    :value="value"
    max-width="1400px"
    content-class="large-image-content-dialog"
  >
    <!-- Desktop Close Button -->
    <div v-if="isCloseable" class="content-dialog-icon">
      <img
        src="@/assets/svg/close-icon.svg"
        alt="close-icon"
        class="content-dialog-close-icon d-none d-md-inline"
        width="32px"
        data-test-id="desktop-close-button"
        @click="$emit('close')"
      >
    </div>

    <v-card :class="cardClasses">
      <v-progress-linear :active="loading" indeterminate height="12px" data-test-id="progress-linear" />

      <v-row no-gutters>
        <v-col cols="4" class="d-none d-md-block">
          <v-img height="100%" data-test-id="image" :src="img" class="!rounded-[16px]" />
        </v-col>

        <v-col cols="12" md="8" class="my-6 my-md-14 px-6">
          <!-- Mobile Close Button -->
          <v-btn v-if="isCloseable" class="d-md-none warning--text mb-4 pl-0" text data-test-id="mobile-close-button" @click="$emit('close')">
            <v-icon left>
              mdi-arrow-left
            </v-icon>
            Back
          </v-btn>

          <!-- Modal Body -->
          <slot name="default" />
        </v-col>
      </v-row>
    </v-card>
  </pg-dialog>
</template>

<script>
export default {
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
    }
  },

  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    },

    cardClasses () {
      return {
        '!rounded-[16px]': !this.isMobile,
        'elevation-0': true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content-dialog-icon {
  position: relative;
  cursor: pointer;
  width: 100%;
  height: 48px;
}

.content-dialog-close-icon {
  position: absolute;
  right: 16px;
}

.\!rounded-\[16px\] {
  border-radius: 16px !important;
}
</style>

<style lang="scss">
.large-image-content-dialog {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  box-shadow: none;
  border-radius: 16px;

  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.large-image-content-dialog::-webkit-scrollbar {
  display: none;
}
</style>
