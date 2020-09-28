<template>
  <span
    v-bind="$attrs"
    class="text-none underlined-title"
    :style="{
      '--ut-line-color': _lineColor,
      '--ut-line-x-size': lineXSize,
      '--ut-background-from': _lineFrom,
      fontSize: _fontSize,
      fontWeight: _fontWeight,
      paddingBottom: _paddingBottom
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
      default: '3rem'
    },

    fontSizeMobile: {
      type: String,
      default: '1.5rem'
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

    lineXSize: {
      type: String,
      default: '1%'
    },

    noAutoresizeFont: Boolean,

    paddingBottom: {
      type: String,
      default: '3px'
    },

    // easy shortcut for faster styling
    // Note: this overrides some others options
    subtitle: Boolean,

    text: {
      type: String,
      required: true
    }
  },

  computed: {
    _lineColor () {
      if (this.subtitle) {
        return 'rgba(254, 197, 114, 0.71)'
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

      if (this.noAutoresizeFont) {
        return this.fontSize
      }

      return this.$vuetify.breakpoint.mdAndUp
        ? this.fontSize
        : this.fontSizeMobile
    },

    _fontWeight () {
      if (this.subtitle) {
        return 500
      }

      return this.fontWeight
    },

    _paddingBottom () {
      if (this.subtitle) {
        return '3px'
      }

      return this.paddingBottom
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
  padding: 0 var(--ut-line-x-size);
  border-radius: 0;
}
</style>
