<script>
import {
  VDataFooter,
  VDataIterator
} from 'vuetify/lib/components/VDataIterator'
import { getPrefixedScopedSlots } from 'vuetify/lib/util/helpers'
import mixins from 'vuetify/lib/util/mixins'

import PgDataFooter from './PgDataFooter'

// eslint-disable-next-line vue/require-direct-export
export default mixins(VDataIterator).extend({
  name: 'PgDataIterator',
  props: {
    hideDefaultFooter: {
      type: Boolean,
      default: true
    },

    hidePgFooter: Boolean
  },

  methods: {
    genFooter (props) {
      if (this.hideDefaultFooter && this.hidePgFooter) {
        return null
      }

      const footer = this.hidePgFooter ? VDataFooter : PgDataFooter

      const data = {
        props: {
          ...this.sanitizedFooterProps,
          options: props.options,
          pagination: props.pagination
        },
        on: {
          'update:options': value => props.updateOptions(value)
        }
      }
      const scopedSlots = getPrefixedScopedSlots('footer.', this.$scopedSlots)

      return this.$createElement(footer, {
        scopedSlots,
        ...data
      })
    }
  }
})
</script>
