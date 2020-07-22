<template>
  <v-snackbar
    v-model="snackbar"
    color="primary darken-2"
    :content-class="(minimized) ? '' : 'container container--fluid mr-0'"
    width="320px"
    max-width="320"
    app
    bottom
    right
    timeout="-1"
    :vertical="!minimized"
  >
    <v-row
      v-for="upload in uploads"
      :key="`upload-progress-${upload.id}`"
      :class="{ 'd-none': minimized }"
      align="center"
      no-gutters
    >
      <v-col>
        <span class="text-caption font-weight-light">
          {{ upload.name | shorten }}
        </span>
      </v-col>
      <v-col>
        <v-progress-linear
          color="accent darken-1"
          height="16"
          striped
          rounded
          :value="upload.progress"
        >
          {{ upload.progress }} %
        </v-progress-linear>
      </v-col>
      <v-btn
        text
        small
        @click.stop="cancelUpload(upload)"
      >
        Cancel
      </v-btn>
    </v-row>
    <template v-slot:action="{ attrs }">
      <span class="text-caption">
        {{ uploads.length }} Upload(s) in progress
      </span>
      <v-btn
        text
        v-bind="attrs"
        @click="minimized = !minimized"
      >
        <span v-if="minimized">
          Show
        </span>
        <span v-else>
          Hide
        </span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AdminSnackBar',
  data: () => {
    return {
      snackbar: false,
      minimized: false
    }
  },

  computed: {
    ...mapGetters('upload', ['uploads'])
  },

  watch: {
    uploads (val, oldVal) {
      // close if no uploads
      if (val.length === 0) {
        this.snackbar = false
        return
      }

      // open if new uploads added or removed
      this.snackbar = true
      this.minimized = false
    }
  },

  methods: {
    ...mapMutations('upload', {
      removeUpload: 'REMOVE_UPLOAD'
    }),

    cancelUpload (upload) {
      this.$nuxt.$emit('open-admin-prompt', {
        title: 'Cancel upload?',
        message: `Are you sure you wish to cancel the upload for '${upload.name}'?`,
        action: () => {
          upload.cancel('CANCELLED_BY_USER')
          this.removeUpload(upload.id)
        }
      })
    }
  }
}
</script>
