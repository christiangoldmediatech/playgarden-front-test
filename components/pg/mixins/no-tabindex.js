export default {
  props: {
    keepTabindex: Boolean
  },

  data: () => ({
    noTabindexSelectors: '.v-input__icon button'
  }),

  mounted () {
    if (!this.keepTabindex) {
      this.$el
        .querySelectorAll(this.noTabindexSelectors)
        .forEach(x => x.setAttribute('tabindex', '-1'))
    }
  }
}
