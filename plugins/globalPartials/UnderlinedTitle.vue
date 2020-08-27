<template>
  <span
    v-bind="$attrs"
    :class="{
      'text-h5 font-weight-bold text-uppercase': $vuetify.breakpoint.smAndDown,
      'text-none': $vuetify.breakpoint.mdAndUp,
      'underlined-title': $vuetify.breakpoint.mdAndUp
    }"
    :style="{
      '--ut-abb-color': _abbColor,
      '--ut-abb-width': _abbFontSize,
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
    abbColor: {
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

    abbFontSize: {
      type: String,
      default: '20px'
    },

    fontSize: {
      type: String,
      default: '50px'
    },

    fontWeight: {
      type: [Number, String],
      default: 'bold'
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
    _abbColor () {
      if (this.subtitle) {
        return 'var(--v-accent-base)'
      }

      // using HEX or vuetify colors vars
      if (typeof this.abbColor === 'string') {
        return this.abbColor
      }

      return `var(--v-${this.abbColor.color}-${this.abbColor.light || 'base'})`
    },

    _abbFontSize () {
      if (this.subtitle) {
        return '5px'
      }

      return this.abbFontSize
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

  &::after {
    width: 102%;
    position: absolute;
    bottom: 15%;
    left: -1%;
    content: "";
    z-index: -1;
    border-bottom-color: var(--ut-abb-color);
    border-bottom-style: solid;
    border-bottom-width: var(--ut-abb-width);
    border-radius: 7px;
  }
}
</style>
