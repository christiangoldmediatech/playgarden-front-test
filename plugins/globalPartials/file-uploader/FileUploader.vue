<template>
  <v-file-input
    v-bind="$props"
    :accept="accepts"
    class="clickable"
    solo
    :value="file"
    @change="$emit('update:file', $event)"
  />
</template>

<script>
import { mapActions } from 'vuex'
import Props from './Props'

export default {
  name: 'FileUploader',

  mixins: [Props],

  data () {
    return {}
  },

  computed: {
    accepts () {
      const list = [
        { 'image/svg+xml': this.svg },
        { 'image/png': this.png },
        { 'image/gif': this.gif },
        { 'image/jpeg': this.jpg },
        { 'application/pdf': this.pdf },
        { 'application/msword': this.doc },
        { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': this.docx },
        { 'text/plain': this.txt },
        { 'application/vnd.ms-excel': this.xls },
        { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': this.xlsx },
        { 'application/zip': this.zip },
        { 'video/mpeg': this.mpeg },
        { 'video/mp4': this.mp4 },
        { '.mov,video/quicktime': this.mov },
        { 'video/webm': this.webm }
      ]

      const compiledList = []

      list.forEach((mimeType) => {
        const key = Object.keys(mimeType)[0]
        if (mimeType[key]) {
          compiledList.push(key)
        }
      })

      const finalList = compiledList.concat(this.mimeTypes)

      return finalList.join(',')
    }
  },

  methods: {
    ...mapActions('upload', ['doUpload', 'doMultiPartBackgroundUpload']),

    async handleUpload (meta = {}, callback = () => {}) {
      let result

      try {
        if (this.multiPart) {
          result = await this.handleMultiPartBackgroundFileUpload(meta, callback)
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