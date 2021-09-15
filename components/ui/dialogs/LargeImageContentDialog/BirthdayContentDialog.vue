<template>
  <v-dialog content-class="w-10" persistent :fullscreen="isMobile" :value="value">
    <v-card :class="{ 'border-4': !isMobile }">
      <v-row no-gutters>
        <v-col cols="12" md="12" class="topm">
          <!-- Desktop Close Button -->
          <v-btn v-if="isCloseable" class="d-none d-md-inline float-right" icon data-test-id="desktop-close-button" @click="$emit('close')">
            <v-icon size="32" color="white">
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
  </v-dialog>
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

<style>

.w-10 .border-4 {
  border-radius: 4px !important;
}

.w-10.float-right {
  float: right;
}
.w-10.v-dialog:not(.v-dialog--fullscreen) > .v-card > .no-gutters > .topm{
  margin-top:-2.2em
}
.w-10.v-dialog{
  overflow-y:visible
}
@media screen and (max-width: 2500px) {
  .w-10.v-dialog:not(.v-dialog--fullscreen) {
    width: 1200px;
  }
}
@media screen and (max-width: 1600px) {
  .w-10.v-dialog:not(.v-dialog--fullscreen) {
    width: 750px !important;
  }
}

/* On screens that are 600px wide or less, make stack on top of each other instead of next to each other */
@media screen and (max-width: 1367px) {
  .w-10.v-dialog:not(.v-dialog--fullscreen) {
    width: 600px !important;
  }
}

</style>
