<script>
import { VDataTable } from 'vuetify/lib/components/VDataTable'
import { VDataFooter } from 'vuetify/lib/components/VDataIterator'
import { getPrefixedScopedSlots, getSlot } from 'vuetify/lib/util/helpers'

import PgDataFooter from './PgDataFooter'
import PgDataIterator from './PgDataIterator'

export default {
  name: 'PgDataTable',

  mixins: [PgDataIterator, VDataTable],

  methods: {
    createItemProps (item) {
      const props = PgDataIterator.options.methods.createItemProps.call(
        this,
        item
      )
      return Object.assign(props, {
        headers: this.computedHeaders
      })
    },

    genFooters (props) {
      const data = {
        props: {
          options: props.options,
          pagination: props.pagination,
          itemsPerPageText: '$vuetify.dataTable.itemsPerPageText',
          ...this.sanitizedFooterProps
        },
        on: {
          'update:options': value => props.updateOptions(value)
        },
        widths: this.widths,
        headers: this.computedHeaders
      }
      const children = [getSlot(this, 'footer', data, true)]

      if (!this.hideDefaultFooter) {
        children.push(
          this.$createElement(VDataFooter, {
            ...data,
            scopedSlots: getPrefixedScopedSlots('footer.', this.$scopedSlots)
          })
        )
      }

      if (!this.hidePgFooter) {
        children.push(
          this.$createElement(PgDataFooter, {
            ...data,
            scopedSlots: getPrefixedScopedSlots('footer.', this.$scopedSlots)
          })
        )
      }

      return children
    }
  }
}
</script>
