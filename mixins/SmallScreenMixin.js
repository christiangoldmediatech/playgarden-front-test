export default {
  computed: {
    smallScreen () {
      return this.$vuetify.breakpoint.mobile || this.$vuetify.breakpoint.smAndDown
    }
  }
}
