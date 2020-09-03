<template>
  <span
    v-bind="$attrs"
    :class="{
      'text-h5 font-weight-bold text-uppercase': $vuetify.breakpoint.smAndDown,
      'text-none': $vuetify.breakpoint.mdAndUp,
      'underlined-title': $vuetify.breakpoint.mdAndUp
    }"
    :style="{
      '--ut-line-color': _lineColor,
      '--ut-background-from': _lineFrom,
      fontSize: _fontSize,
      fontWeight: _fontWeight
    }"
    v-on="$listeners"
  >
    {{ text }}
  </span>
</template>

<script>
export default {
  name: 'UnderlinedTitle',

  props: {
    fontSize: {
      type: String,
      default: '50px'
    },

    fontWeight: {
      type: [Number, String],
      default: 'bold'
    },

    lineColor: {
      type: [Object, String],
      default: () => ({ color: 'primary', light: 'base' }),
      validator: (value) => {
        if (!value) {
          return false
        }

        // using HEX or vuetify colors vars
        if (typeof value === 'string') {
          return true
        }

        // using vuetify color with object
        if (!value.color || !value.light) {
          return false
        }

        if (
          ![
            'primary',
            'secondary',
            'accent',
            'error',
            'info',
            'success',
            'warning',
            'black'
          ].includes(value.color)
        ) {
          return false
        }

        return (
          !value.light ||
          [
            'base',
            'lighten5',
            'lighten4',
            'lighten3',
            'lighten2',
            'lighten1',
            'darken1',
            'darken2',
            'darken3',
            'darken4'
          ].includes(value.light)
        )
      }
    },

    lineFrom: {
      type: Number,
      default: 55
    },

    // easy shortcut for faster styling
    // Note: it override the others options
    subtitle: Boolean,

    text: {
      type: String,
      required: true
    }
  },

  computed: {
    _lineColor () {
      if (this.subtitle) {
        return 'var(--v-accent-base)'
      }

      // using HEX or vuetify colors vars
      if (typeof this.lineColor === 'string') {
        return this.lineColor
      }

      return `var(--v-${this.lineColor.color}-${this.lineColor.light ||
        'base'})`
    },

    _lineFrom () {
      if (this.subtitle) {
        return '65%'
      }

      return `${this.lineFrom}%`
    },

    _fontSize () {
      if (this.subtitle) {
        return '18px'
      }

      return this.fontSize
    },

    _fontWeight () {
      if (this.subtitle) {
        return 500
      }

      return this.fontWeight
    }
  }
}
</script>

<style lang="scss" scoped>
.underlined-title {
  position: relative;
  z-index: 1;
  color: $pg-black;

  background: linear-gradient(
    180deg,
    transparent var(--ut-background-from),
    var(--ut-line-color) var(--ut-background-from),
    var(--ut-line-color) 80%,
    transparent 80%
  );
  padding: 0 1%;
  border-radius: 0px;
}
</style>
