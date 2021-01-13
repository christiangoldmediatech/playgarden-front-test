<script>
// TODO: add support to v-slot:addable in template HTML

import { VAutocomplete } from 'vuetify/lib/components/VAutocomplete'

import { consoleError } from 'vuetify/lib/util/console' // Types
import { getPropertyFromItem } from 'vuetify/lib/util/helpers'

import noTabindex from '@/components/pg/mixins/no-tabindex'
import soloLabeled from '@/components/pg/mixins/solo-labeled'
import validatable from '@/components/pg/mixins/validatable'

import PgSelectList from './PgSelectList'

export default {
  name: 'PgAutocomplete',

  mixins: [VAutocomplete, noTabindex, soloLabeled, validatable],

  props: {
    addable: Boolean
  },

  data: () => ({
    addedItems: []
  }),

  computed: {
    classes () {
      return {
        'v-autocomplete--solo-labeled': this.soloLabeled,
        ...VAutocomplete.options.computed.classes.call(this)
      }
    },

    allItems () {
      return this.filterDuplicates(
        this.cachedItems.concat(this.items, this.addedItems)
      )
    },

    reducedItems () {
      return this.filteredItems.reduce((previous, current) => {
        const value = getPropertyFromItem(current, this.itemText)

        return { ...previous, [value]: 1 }
      }, {})
    },

    selectedValues () {
      return [...this.selectedItems, ...this.addedItems].map(item =>
        this.getValue(item)
      )
    },

    menuCanShow () {
      if (!this.isFocused) {
        return false
      }
      return (
        this.hasDisplayedItems ||
        (this.addable && (this.searchInput || this.internalSearch)) ||
        !this.hideNoData
      )
    },

    listData () {
      const scopeId = this.$vnode && this.$vnode.context.$options._scopeId
      const attrs = scopeId
        ? {
          [scopeId]: true
        }
        : {}
      return {
        attrs: { ...attrs, id: this.computedOwns },
        props: {
          action: this.multiple,
          addable:
            this.addable &&
            !this.reducedItems[this.searchInput || this.internalSearch],
          color: this.itemColor,
          dense: this.dense,
          hideNoData: this.hideNoData,
          hideSelected: this.hideSelected,
          items: this.virtualizedItems,
          itemDisabled: this.itemDisabled,
          itemText: this.itemText,
          itemValue: this.itemValue,
          noDataText: this.$vuetify.lang.t(this.noDataText),
          searchInput: this.searchInput || this.internalSearch,
          selectedItems: this.selectedItems
        },
        on: {
          select: this.selectItem,
          'update:item-added': this.onItemAdded
        },
        scopedSlots: {
          item: this.$scopedSlots.item
        }
      }
    },

    staticList () {
      if (
        this.$slots['no-data'] ||
        this.$slots.addable ||
        this.$slots['prepend-item'] ||
        this.$slots['append-item']
      ) {
        consoleError(
          'assert: staticList should not be called if slots are used'
        )
      }

      return this.$createElement(PgSelectList, this.listData)
    }
  },

  methods: {
    genList () {
      // If there's no slots, we can use a cached VNode to improve performance
      if (
        this.$slots['no-data'] ||
        this.$slots.addable ||
        this.$slots['prepend-item'] ||
        this.$slots['append-item']
      ) {
        return this.genListWithSlot()
      } else {
        return this.staticList
      }
    },

    genListWithSlot () {
      const slots = ['prepend-item', 'no-data', 'addable', 'append-item']
        .filter(slotName => this.$slots[slotName])
        .map(slotName =>
          this.$createElement(
            'template',
            {
              slot: slotName
            },
            this.$slots[slotName]
          )
        ) // Requires destructuring due to Vue
      // modifying the `on` property when passed
      // as a referenced object

      return this.$createElement(PgSelectList, { ...this.listData }, slots)
    },

    onItemAdded () {
      const search = this.searchInput || this.internalSearch

      const value = this.returnObject
        ? {
          [this.itemText]: search,
          [this.itemValue]: search
        }
        : search

      this.addedItems.push(value)

      if (this.multiple) {
        if (!Array.isArray(this.internalValue)) {
          this.internalValue = [value]
        } else {
          this.internalValue.push(value)
        }
      } else {
        this.internalValue = value
      }

      this.internalSearch = ''

      this.setSelectedItems()

      this.$emit('update:item-added', search)
    }
  }
}
</script>
