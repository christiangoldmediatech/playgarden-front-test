export default {
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
  }
}
