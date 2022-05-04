<template>
  <span
    v-bind="$attrs"
    class="text-none underlined-title"
    :style="{
      '--ut-line-color': _lineColor,
      '--ut-line-color-dark-green': _lineColorDarkGreen,
      '--ut-line-padding-right': linePaddingRight,
      '--ut-line-padding-left': linePaddingLeft,
      '--ut-background-from': _lineFrom,
      '--ut-background-from-1': _lineFrom,
      fontSize: _fontSize,
      fontWeight: _fontWeight,
      paddingBottom: _paddingBottom,
      lineHeight,
      letterSpacing
    }"
    v-on="$listeners"
  >
    <slot name="default">
      <span v-html="text" />
    </slot>
  </span>
</template>

<script>
import { colorValidator } from '@/components/pg/utils/validators'
import { colorMaker } from '@/components/pg/utils/colorable'

export default {
  name: 'UnderlinedTitle',

  props: {
    fontSize: {
      type: String,
      default: '3rem'
    },

    fontSizeMobile: {
      type: String,
      default: '2rem'
    },

    fontWeight: {
      type: [Number, String],
      default: 'bold'
    },

    lineHeight: {
      type: String,
      required: false,
      default: '1.2'
    },

    lineColor: {
      type: [Object, String],
      default: () => ({ color: 'green2', light: 'base' }),
      validator: colorValidator
    },

    lineColorDarkGreen: {
      type: [Object, String],
      default: () => ({ color: 'primary', light: 'base' }),
      validator: colorValidator
    },

    lineFrom: {
      type: Number,
      default: 55
    },

    linePaddingLeft: {
      type: String,
      default: '1%'
    },

    linePaddingRight: {
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
      default: ''
    },

    letterSpacing: {
      type: String,
      default: '2px'
    }
  },

  computed: {
    _lineColor() {
      if (this.subtitle) {
        return 'rgba(254, 197, 114, 0.71)'
      }

      return colorMaker(this.lineColor)
    },
    _lineColorDarkGreen() {
      if (this.subtitle) {
        return 'rgba(254, 197, 114, 0.71)'
      }

      return colorMaker(this.lineColorDarkGreen)
    },

    _lineFrom() {
      if (this.subtitle) {
        return '65%'
      }

      return `${this.lineFrom}%`
    },

    _fontSize() {
      if (this.subtitle) {
        return '17px'
      }

      if (this.noAutoresizeFont) {
        return this.fontSize
      }

      return this.$vuetify.breakpoint.mdAndUp
        ? this.fontSize
        : this.fontSizeMobile
    },

    _fontWeight() {
      if (this.subtitle) {
        return 500
      }

      return this.fontWeight
    },

    _paddingBottom() {
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
  color: var(--v-black-base);
  background: linear-gradient(
    180deg,
    transparent var(--ut-background-from),
    var(--ut-line-color) var(--ut-background-from),
    var(--ut-line-color) 80%,
    transparent 80%
  );
  padding-top: 0;
  padding-bottom: 0;
  padding-left: var(--ut-line-padding-left);
  padding-right: var(--ut-line-padding-right);
  border-radius: 0;
}
.underlined-title-dark-green {
  background: linear-gradient(
    180deg,
    transparent var(--ut-background-from),
    var(--ut-line-color-dark-green) var(--ut-background-from),
    var(--ut-line-color-dark-green) 80%,
    transparent 80%
  );
}
.text-spacing {
  letter-spacing: 2px !important;
}
</style>
