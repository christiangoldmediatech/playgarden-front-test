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

    noAutoTrackChange: {
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
    },

    showRestart: {
      type: Boolean,
      required: false,
      default: false
    },

    showVideoSkip: {
      type: Boolean,
      required: false,
      default: false
    },

    showSteps: {
      type: Boolean,
      required: false,
      default: false
    },

    useStandardPoster: {
      type: Boolean,
      required: false,
      default: false
    },

    inline: {
      type: Boolean,
      required: false,
      default: false
    },

    showFavorite: {
      type: Boolean,
      required: false,
      default: false
    },

    showCast: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
