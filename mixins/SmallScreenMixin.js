export default {
  props: {
    noSmallscreen: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    smallScreen () {
      if (this.noSmallscreen) {
        return false
      }
      return this.$vuetify.breakpoint.mobile || this.$vuetify.breakpoint.smAndDown
    }
  }
}
