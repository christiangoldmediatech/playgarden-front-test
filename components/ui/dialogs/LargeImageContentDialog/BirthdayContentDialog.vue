<template>
  <pg-dialog persistent :fullscreen="isMobile" :value="value">
    <v-card :class="{ 'border-4': !isMobile }">
      <v-row no-gutters>
        <v-col cols="16" md="12" class="topm">
          <!-- Desktop Close Button -->
          <v-btn v-if="isCloseable" class="d-none d-md-inline float-right" icon data-test-id="desktop-close-button" @click="$emit('close')">
            <v-icon size="32">
              mdi-close
            </v-icon>
          </v-btn>

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
  name: 'BirthdayContentDialog',

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

.border-4 {
  border-radius: 4px !important;
}

.float-right {
  float: right;
}
.v-dialog:not(.v-dialog--fullscreen) > .v-card > .no-gutters > .topm{
  margin-top:-2.2em
}
.v-dialog:not(.v-dialog--fullscreen) > .v-card > .no-gutters > .topm > button > span > .v-icon{
  color: white !important;
}
</style>
