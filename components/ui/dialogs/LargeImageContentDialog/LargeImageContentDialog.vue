<template>
  <pg-dialog persistent :fullscreen="isMobile" :value="value" max-width="1400px">
    <v-card :class="{ 'border-16': !isMobile }">
      <v-row no-gutters>
        <v-col cols="4" class="d-none d-md-block">
          <v-img height="100%" data-test-id="image" :src="img" class="border-left-16" />
        </v-col>
        <v-col cols="12" md="8" class="my-6 my-md-14 px-6">
          <!-- Desktop Close Button -->
          <v-btn class="d-none d-md-inline float-right" icon data-test-id="desktop-close-button" @click="$emit('close')">
            <v-icon size="32">
              mdi-close
            </v-icon>
          </v-btn>

          <!-- Mobile Close Button -->
          <v-btn class="d-md-none warning--text mb-4 pl-0" text data-test-id="mobile-close-button" @click="$emit('close')">
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
    }
  },

  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  }
}
</script>

<style scoped>
.border-left-16 {
  border-radius: 16px 0px 0px 16px !important;
}

.border-16 {
  border-radius: 16px !important;
}

.float-right {
  float: right;
}
</style>
