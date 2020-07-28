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

export default {
  name: 'FileUploader',

  props: {
    mimeTypes: {
      type: Array,
      required: false,
      default: () => []
    },
    file: {
      required: true,
      type: null,
      default: null
    },
    mode: {
      type: String,
      required: true,
      validator: (value) => {
        return ['image', 'document', 'video', 'file'].includes(value) !== -1
      }
    },
    backgroundUpload: {
      type: Boolean,
      required: false,
      default: false
    },
    multiPart: {
      type: Boolean,
      required: false,
      default: false
    },
    clearable: {
      type: Boolean,
      required: false,
      default: true
    },
    dense: {
      type: Boolean,
      required: false,
      default: true
    },
    label: {
      type: String,
      required: false,
      default: 'Upload File'
    },
    path: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Select a file'
    },
    prependIcon: {
      type: String,
      required: false,
      default: 'mdi-file'
    },
    appendIcon: {
      type: String,
      required: false,
      default: ''
    },
    showSize: {
      type: Boolean,
      required: false,
      default: true
    },
    /* preprogrammed mime types */
    svg: {
      type: Boolean,
      required: false,
      default: false
    },
    png: {
      type: Boolean,
      required: false,
      default: false
    },
    gif: {
      type: Boolean,
      required: false,
      default: false
    },
    jpg: {
      type: Boolean,
      required: false,
      default: false
    },
    pdf: {
      type: Boolean,
      required: false,
      default: false
    },
    doc: {
      type: Boolean,
      required: false,
      default: false
    },
    docx: {
      type: Boolean,
      required: false,
      default: false
    },
    txt: {
      type: Boolean,
      required: false,
      default: false
    },
    xls: {
      type: Boolean,
      required: false,
      default: false
    },
    xlsx: {
      type: Boolean,
      required: false,
      default: false
    },
    zip: {
      type: Boolean,
      required: false,
      default: false
    },
    mpeg: {
      type: Boolean,
      required: false,
      default: false
    },
    mp4: {
      type: Boolean,
      required: false,
      default: false
    },
    mov: {
      type: Boolean,
      required: false,
      default: false
    },
    webm: {
      type: Boolean,
      required: false,
      default: false
    }
  },

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
        { 'video/quicktime': this.mov },
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

      return finalList.join(' ')
    }
  },

  methods: {
    ...mapActions('upload', ['doUpload', 'doBackgroundUpload', 'doMultiPartBackgroundUpload']),

    async handleUpload (meta = {}, callback = () => {}) {
      let result

      if (this.multiPart) {
        result = await this.handleMultiPartBackgroundFileUpload(meta, callback)
      } else if (this.backgroundUpload) {
        result = await this.handleBackgroundFileUpload(meta, callback)
      } else {
        result = await this.handleFileUpload()
      }

      return result
    },

    async handleFileUpload () {
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
      return false
    },

    handleBackgroundFileUpload (meta = {}, callback = () => {}) {
      if (this.file) {
        const formData = new FormData()
        formData.append('file', this.file)
        this.doBackgroundUpload({
          type: `upload-${this.mode}`,
          path: this.path,
          name: this.file.name,
          formData,
          callback,
          meta
        })
        return true
      }
      return false
    },

    async handleMultiPartBackgroundFileUpload (meta = {}, callback = () => {}) {
      if (this.file) {
        const result = await this.doMultiPartBackgroundUpload({
          type: `upload-${this.mode}`,
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
