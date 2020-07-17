<template>
  <v-file-input
    v-model="file"
    v-bind="$props"
    class="clickable"
    outlined
  />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'FileUploader',

  props: {
    accept: {
      type: String,
      required: false,
      default: 'image/png, image/jpeg'
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
      default: 'Upload Image'
    },
    path: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Select an image'
    },
    prependIcon: {
      type: String,
      required: false,
      default: 'mdi-camera'
    },
    showSize: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data () {
    return {
      file: null
    }
  },

  methods: {
    ...mapActions('admin/upload', ['doUpload']),

    async handleFileUpload () {
      if (this.file) {
        const formData = new FormData()
        formData.append('file', this.file)
        const { filePath } = await this.doUpload({ path: this.path, formData })
        return filePath
      }
      return false
    },

    reset () {
      this.file = null
    }
  }
}
</script>
