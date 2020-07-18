<template>
  <v-file-input
    v-bind="$props"
    :accepts="accepts"
    class="clickable"
    outlined
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
        { 'video/webm': this.mpeg }
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
    ...mapActions('upload', ['doUpload']),

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
    }
  }
}
</script>
