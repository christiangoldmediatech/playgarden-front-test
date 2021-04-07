export default {
  props: {
    /*
     * VUETIFY FILE INPUT PROPS
     */
    clearable: {
      type: Boolean,
      required: false,
      default: true
    },
    prependIcon: {
      type: String,
      default: ''
    },
    showSize: {
      type: Boolean,
      required: false,
      default: true
    },

    /*
     * FILE UPLOADER PROPS
     */
    mimeTypes: {
      type: Array,
      required: false,
      default: () => []
    },
    api: {
      type: String,
      required: false
    },
    mode: {
      type: String,
      required: true,
      validator: value => ['image', 'document', 'video', 'file', 'song'].includes(value)
    },
    multiPart: {
      type: Boolean,
      required: false,
      default: false
    },
    path: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      default: undefined,
      required: false
    },

    /*
     * PRE-MADE MIME TYPES
     */
    // DOCUMENTS
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
    pdf: {
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

    // FILES
    zip: {
      type: Boolean,
      required: false,
      default: false
    },

    // SONGS
    mp3: {
      type: Boolean,
      required: false,
      default: false
    },
    m4a: {
      type: Boolean,
      required: false,
      default: false
    },
    wav: {
      type: Boolean,
      required: false,
      default: false
    },

    // IMAGES
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
    png: {
      type: Boolean,
      required: false,
      default: false
    },
    svg: {
      type: Boolean,
      required: false,
      default: false
    },

    // VIDEOS
    mov: {
      type: Boolean,
      required: false,
      default: false
    },
    mp4: {
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
  }
}
