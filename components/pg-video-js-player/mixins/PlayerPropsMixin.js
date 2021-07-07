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
    },

    nextPatch: {
      type: Boolean,
      required: false,
      default: false
    },

    nextPuzzle: {
      type: Boolean,
      required: false,
      default: false
    },

    nextUnlockImage: {
      validator: (val) => {
        return val === null || typeof val === 'string'
      },
      required: false,
      default: null
    },

    nextUnlockNumber: {
      validator: (val) => {
        return val === null || typeof val === 'number'
      },
      required: false,
      default: null
    },

    onNextUpClick: {
      type: Function,
      required: false,
      default: () => {}
    }
  }
}
