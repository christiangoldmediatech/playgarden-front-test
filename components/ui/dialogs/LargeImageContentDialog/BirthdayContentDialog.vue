<template>
  <div class="container-modal">
    <v-dialog
      class="test"
      content-class="w-10"
      persistent
      :fullscreen="isMobile"
      :value="value"
      :width="isMobile ? undefined : '60%'"
    >
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
  </div>
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

.border-4 {
  border-radius: 4px !important;
}

.float-right {
  float: right;
}

::v-deep .v-dialog:not(.v-dialog--fullscreen) > .v-card > .no-gutters > .topm{
  margin-top:-2.2em
}

::v-deep .v-dialog{
  overflow-y:visible
}
</style>
