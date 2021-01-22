<template>
  <pg-file-input
    v-model="file"
    v-bind="$attrs"
    :accept="accept"
    :clearable="clearable"
    :prepend-icon="prependIcon"
    :show-size="showSize"
    class="clickable"
  />
</template>

<script>
import { mapActions } from 'vuex'

import props from './props'

export default {
  name: 'FileUploader',

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
    }
  },

  methods: {
    ...mapActions('upload', ['doUpload', 'doMultiPartBackgroundUpload']),

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

    async handleMultiPartBackgroundFileUpload (meta = {}, callback = () => {}) {
      console.log('file--', this.file)
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
    }
  }
}
</script>
