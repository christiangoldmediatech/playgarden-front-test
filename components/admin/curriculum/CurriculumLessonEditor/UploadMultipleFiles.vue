<template>
  <div class="">
    <v-row justify="end">
      <v-btn
        class="text-h7 text-md-h6 mb-3 mr-4"
        color="primary"
        :small="$vuetify.breakpoint.xs"
        @click="addComponent"
      >
        + FILE
      </v-btn>
      <v-btn
        class="text-h7 text-md-h6 mb-3 mr-4"
        color="accent"
        :small="$vuetify.breakpoint.xs"
        @click="removeComponent"
      >
        - REMOVE
      </v-btn>
    </v-row>
    <template v-for="fileComponent in getTotalComponents">
      <validation-provider
        v-slot="{ errors }"
        :key="fileComponent"
        :name="`File-${fileComponent}`"
        rules="required"
      >
        <pg-file-uploader
          :ref="`documentFileUploaderDropBox-${fileComponent}`"
          v-model="file"
          prepend-icon="mdi-file"
          :file-name="fileName"
          :error-messages="errors"
          :label="`Upload File-${fileComponent}`"
          mode="document"
          path="lesson"
          placeholder="Select a pdf for this lesson"
          solo-labeled
          api="dropbox"
          pdf
        />
      </validation-provider>
    </template>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UploadMultipleFiles',

  data: () => ({
    componentsNumber: 1,
    files: [],
    fileName: 'file',
    file: null
  }),

  computed: {
    getTotalComponents () {
      return this.componentsNumber
    }
  },

  mounted () {
    this.joinFiles()
  },

  methods: {
    addComponent () {
      this.componentsNumber += 1
    },

    removeComponent () {
      if (this.componentsNumber > 1) {
        this.componentsNumber -= 1
      }
    },

    joinFiles () {
      for (let i = 1; i === this.componentsNumber; i++) {
        console.log('file--', this.$refs[`documentFileUploaderDropBox-${i}`].getFile)
      }
    }
  }
}
</script>
