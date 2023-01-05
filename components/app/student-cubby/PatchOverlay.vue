<template>
  <pg-dialog
    :value="overlay"
    persistent
    fullscreen
    content-class="patch-overlay-dialog"
  >
    <v-row no-gutters>
      <v-col cols="ml-3 mb-15">
        <v-btn
          class="text-none white--text"
          text
          x-large
          @click.stop="overlay = false"
        >
          <v-icon class="mr-2" small left>
            mdi-less-than
          </v-icon>

          Back
        </v-btn>
      </v-col>
    </v-row>

    <v-container class="pa-0 fullscreen-overlay mt-10" fluid>
      <v-row class="fill-height" align="center" justify="center" no-gutters>
        <patch display-mode :patch="patch" />

        <pg-social-buttons
          v-if="overlay"
          class="mt-6"
          :description="patch.description"
          entity-auto-resolve
          :child-id="childId"
          :entity-id="patch.id"
          entity-type="PATCH"
          :mini-variant="!$vuetify.breakpoint.xs"
          :url="patch.image"
          :quote="patch.name"
          :title="patch.name"
        />
      </v-row>
    </v-container>
  </pg-dialog>
</template>

<script>
import Patch from './Patch.vue'

export default {
  name: 'PatchOverlay',

  components: {
    Patch
  },

  data: () => {
    return {
      patch: null,
      overlay: false
    }
  },

  computed: {
    childId() {
      const id = this.$route.query.id

      return Number(id)
    }
  },

  created () {
    this.$nuxt.$on('close-patch-overlay', () => {
      this.overlay = false
    })

    this.$nuxt.$on('open-patch-overlay', (patch) => {
      this.patch = patch
      this.overlay = true
    })
  }
}
</script>

<style lang="scss">
.patch-overlay-dialog {
  background-color: rgba(0, 0, 0, 0.68) !important;
  border-color: rgba(0, 0, 0, 0.68) !important;
}
</style>
