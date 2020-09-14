<template>
  <v-overlay :value="overlay" dark z-index="100">
    <v-container class="pa-0 fullscreen-overlay" fluid>
      <v-row no-gutters>
        <v-col cols="ml-3 mt-3">
          <v-btn class="text-none" text x-large @click.stop="overlay = false">
            <v-icon class="mr-2" small left>
              mdi-less-than
            </v-icon>
            Back
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="fill-height" align="center" justify="center">
        <patch display-mode :patch="patch" :unblocked="unblocked" />
      </v-row>
    </v-container>
  </v-overlay>
</template>

<script>
import Patch from './Patch.vue'

export default {
  name: 'PatchOverlay',

  components: {
    Patch
  },

  props: {
    unblocked: {
      type: Object,
      required: true
    }
  },

  data: () => {
    return {
      patch: null,
      overlay: false
    }
  },

  created () {
    this.$nuxt.$on('close-patch-overlay', () => {
      this.patch = null
      this.overlay = false
    })

    this.$nuxt.$on('open-patch-overlay', (patch) => {
      this.patch = patch
      this.overlay = true
    })
  }
}
</script>
