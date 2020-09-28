export default {
  computed: {
    messagesToDisplay () {
      if (this.hasHint) {
        return [this.hint]
      }

      if (!this.hasMessages || !this.hasFocused) {
        return []
      }

      return this.validations
        .map((validation) => {
          if (typeof validation === 'string') {
            return validation
          }

          const validationResult = validation(this.internalValue)

          return typeof validationResult === 'string' ? validationResult : ''
        })
        .filter(message => message !== '')
    },

    hasError () {
      return (
        (this.internalErrorMessages.length > 0 ||
          this.errorBucket.length > 0 ||
          this.error) &&
        this.hasFocused
      )
    }
  }
}
