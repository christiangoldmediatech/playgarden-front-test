<template>
  <span
    v-bind="$attrs"
    class="text-none"
    :style="{
      '--ut-background-from': _lineFrom,
      '--ut-background-from-1': _lineFrom,
      fontSize: _fontSize,
      fontWeight: _fontWeight,
      paddingBottom: _paddingBottom,
      lineHeight,
      letterSpacing,
      fontFamily,
      color
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
  name: 'NormalTitle',

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

    lineFrom: {
      type: Number,
      default: 55
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
    },

    fontFamily: {
      type: String,
      default: "'Poppins', sans-serif"
    },

    color: { type: String, default: '#000000' }
  },

  computed: {
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
.text-spacing {
  letter-spacing: 2px !important;
}
</style>
