export default {
  props: {
    noSeek: {
      type: Boolean,
      required: false,
      default: false
    },

    noSmallscreen: {
      type: Boolean,
      required: false,
      default: false
    },

    showNextUp: {
      type: Boolean,
      required: false,
      default: true
    },

    autoplay: {
      type: Boolean,
      required: false,
      default: false
    },

    fullscreenOverride: {
      validator: (val) => {
        return typeof val === 'function' || val === null
      },
      required: false,
      default: null
    }
  }
}