export default {
  props: {
    player: {
      type: Object,
      required: true
    },

    status: {
      type: String,
      required: true
    },

    position: {
      type: Number,
      required: true
    },

    duration: {
      type: Number,
      required: true
    },

    volume: {
      type: Number,
      required: true
    },

    muted: {
      type: Boolean,
      required: true
    },

    fullscreen: {
      type: Boolean,
      required: true
    },

    nextUp: {
      type: Object,
      required: true
    },

    noSeek: {
      type: Boolean,
      required: true
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

    inline: {
      type: Boolean,
      required: false,
      default: false
    },

    nextPatch: {
      type: Boolean,
      required: false,
      default: false
    },

    nextPatchData: {
      type: Object,
      required: true
    }
  }
}
