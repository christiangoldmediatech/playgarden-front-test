export default {
  props: {
    soloLabeled: Boolean
  },

  computed: {
    isSingle () {
      return (
        (this.isSolo && !this.soloLabeled) ||
        this.singleLine ||
        this.fullWidth || // https://material.io/components/text-fields/#filled-text-field
        (this.filled && !this.hasLabel)
      )
    },

    isSolo () {
      return this.solo || this.soloLabeled || this.soloInverted
    }
  }
}
