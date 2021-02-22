<template>
  <v-row>
    <v-col cols="10">
      <pg-file-input
        v-model="file"
        v-bind="$attrs"
        :accept="accept"
        :clearable="clearable"
        :prepend-icon="prependIcon"
        :show-size="showSize"
        class="clickable"
      />
    </v-col>
    <v-col v-if="api === 'dropbox'" cols="2" class="mt-2">
      <v-btn block height="45" class="btn-dropbox" text @click="dropboxIconClicked">
        <img
          alt="Dropbox"
          class="mr-1"
          src="@/assets/svg/dropbox.svg"
          height="40"
        >
        <span class="text-transform-none">Open DropBox</span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import props from '@/plugins/globalPartials/file-uploader/props'

export default {
  name: 'PgFileUploader',

  mixins: [props],

  computed: {
    accept () {
      const list = [
        { 'image/svg+xml': this.svg },
        { 'image/png': this.png },
        { 'image/gif': this.gif },
        { 'image/jpeg': this.jpg },
        { 'application/pdf': this.pdf },
        { 'application/msword': this.doc },
        {
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': this
            .docx
        },
        { 'text/plain': this.txt },
        { 'application/vnd.ms-excel': this.xls },
        {
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': this
            .xlsx
        },
        { 'application/zip': this.zip },
        { 'video/mpeg': this.mpeg },
        { 'video/mp4': this.mp4 },
        { '.mov,video/quicktime': this.mov },
        { 'video/webm': this.webm }
      ]

      const compiledList = []

      list.map((mimeType) => {
        const key = Object.keys(mimeType)[0]

        if (mimeType[key]) {
          compiledList.push(key)
        }
      })

      const finalList = compiledList.concat(this.mimeTypes)

      return finalList.join(',')
    },

    file: {
      get () {
        return this.value
      },

      set (input) {
        this.$emit('input', input)
      }
    },

    getExtensions () {
      let extensions = []
      switch (this.mode) {
        case 'document':
          extensions = ['.pdf', '.doc', '.docx', '.xlsx', '.pptx']
          break
        case 'video':
          extensions = ['.mp4', '.mov']
          break
        case 'image':
          extensions = ['.jpg', '.jpeg', '.png', '.gif']
          break
      }
      return extensions
    }
  },

  methods: {
    ...mapActions('upload', ['doUpload', 'doMultiPartBackgroundUpload', 'doMultiPartDropBoxUpload']),

    async handleUpload (meta = {}, callback = () => {}) {
      let result

      try {
        if (this.multiPart) {
          result = await this.handleMultiPartBackgroundFileUpload(
            meta,
            callback
          )
        } else {
          result = await this.handleFileUpload()
        }
      } catch (error) {
        return Promise.reject(error)
      }

      return result
    },

    async handleFileUpload () {
      try {
        if (this.file) {
          const formData = new FormData()
          formData.append('file', this.file)
          if (this.fileName) {
            formData.append('name', this.fileName)
          }

          const { filePath } = await this.doUpload({
            type: `upload-${this.mode}`,
            path: this.path,
            formData
          })

          return filePath
        }
      } catch (error) {
        return Promise.reject(error)
      }
      return false
    },

    dropboxIconClicked () {
      const options = {
        success: (files) => {
          const attachment = {}
          attachment._id = files[0].id
          attachment.name = files[0].name
          attachment.size = files[0].bytes
          attachment.iconURL = files[0].icon
          attachment.link = files[0].link
          attachment.extension = `.${files[0].name.split('.')[1]}`
          this.file = attachment
        },

        cancel: () => {},

        linkType: 'direct',

        multiselect: false,

        extensions: this.getExtensions,

        folderselect: false
      }
      window.Dropbox.choose(options)
    },

    async handleMultiPartBackgroundFileUpload (meta = {}, callback = () => {}) {
      if (this.file) {
        const result = await this.doMultiPartBackgroundUpload({
          type: `upload-${this.mode}`,
          mode: this.mode,
          path: this.path,
          file: this.file,
          callback,
          meta
        })

        return result
      }
      return false
    },

    async handleDropBoxFileUpload (meta = {}, callback = () => {}) {
      if (this.file) {
        const result = await this.doMultiPartDropBoxUpload({
          name: this.file.name,
          link: this.file.link,
          size: this.file.size,
          type: `upload-${this.mode}-dropbox`,
          path: this.path,
          mode: this.mode,
          extension: this.file.extension
        })
        return result
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-dropbox {
  text-transform: capitalize !important;
  font-size: 14px !important;
}
</style>
