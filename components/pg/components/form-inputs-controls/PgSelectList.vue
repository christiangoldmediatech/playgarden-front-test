<script>
import { VList, VListItem } from 'vuetify/lib/components/VList'
import VSelectList from 'vuetify/lib/components/VSelect/VSelectList'

export default {
  name: 'PgSelectList',

  mixins: [VSelectList],

  props: {
    addable: Boolean,
    hideNoData: Boolean
  },

  computed: {
    staticAddableTile () {
      const tile = {
        attrs: {
          role: undefined
        },
        on: {
          mousedown: e => e.preventDefault(),
          click: () => this.$emit('update:item-added')
        }
      }

      return this.$createElement(VListItem, tile, [
        this.genTileContent(`Add: ${this.searchInput}`)
      ])
    }
  },

  render () {
    const children = []
    const itemsLength = this.items.length

    for (let index = 0; index < itemsLength; index++) {
      const item = this.items[index]
      if (this.hideSelected && this.hasItem(item)) {
        continue
      }
      if (!item) {
        children.push(
          this.genTile({
            item,
            index
          })
        )
      } else if (item.header) {
        children.push(this.genHeader(item))
      } else if (item.divider) {
        children.push(this.genDivider(item))
      } else {
        children.push(
          this.genTile({
            item,
            index
          })
        )
      }
    }

    children.length ||
      this.hideNoData ||
      children.push(this.$slots['no-data'] || this.staticNoDataTile)

    !this.addable ||
      !this.searchInput ||
      children.push(this.$slots.addable || this.staticAddableTile)

    this.$slots['prepend-item'] &&
      children.unshift(this.$slots['prepend-item'])
    this.$slots['append-item'] && children.push(this.$slots['append-item'])

    return this.$createElement(
      VList,
      {
        staticClass: 'v-select-list',
        class: this.themeClasses,
        attrs: {
          role: 'listbox',
          tabindex: -1
        },
        props: {
          dense: this.dense
        }
      },
      children
    )
  }
}
</script>
