<script>
import { VDataTable, VSimpleTable } from 'vuetify/lib/components/VDataTable'
import { VDataFooter } from 'vuetify/lib/components/VDataIterator'
import { VSkeletonLoader } from 'vuetify/lib/components/VSkeletonLoader'
import { VSpacer } from 'vuetify/lib/components/VGrid'
import { VToolbar } from 'vuetify/lib/components/VToolbar'
import { getPrefixedScopedSlots, getSlot } from 'vuetify/lib/util/helpers'

import { formatDate } from '@/utils/dateTools'

import PgBtn from '../PgBtn'
import PgIcon from '../PgIcon'
import PgTextField from '../form-inputs-controls/PgTextField'
import PgDataFooter from './PgDataFooter'
import PgDataIterator from './PgDataIterator'

export default {
  name: 'PgDataTable',

  mixins: [PgDataIterator, VDataTable],

  props: {
    hideDefaultFooter: {
      type: Boolean,
      default: true
    },

    hideDefaultTop: Boolean,

    noSearchable: Boolean,

    noActionEdit: Boolean,

    noActionDelete: Boolean
  },

  data: () => ({
    searchField: null
  }),

  computed: {
    hasActionsHeader () {
      return Boolean(this.headers.find(({ value }) => value === 'actions'))
    },

    hasCreatedAtHeader () {
      return Boolean(this.headers.find(({ value }) => value === 'createdAt'))
    },

    hasUpdateAtHeader () {
      return Boolean(this.headers.find(({ value }) => value === 'updatedAt'))
    }
  },

  methods: {
    genDefaultActionsItem (action) {
      const children = []

      if (this.$scopedSlots['item.actions.prepend']) {
        children.push(this.$scopedSlots['item.actions.prepend'](action))
      }

      if (!this.noActionEdit) {
        children.push(
          this.$createElement(
            PgIcon,
            {
              props: {
                color: '#81A1F7',
                dense: true
              },
              on: {
                click: (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  this.$emit('click:edit', action)
                  this.$emit('click:edit-item', action.item)
                }
              }
            },
            ['mdi-pencil-outline']
          )
        )
      }

      if (!this.noActionDelete) {
        children.push(
          this.$createElement(
            PgIcon,
            {
              props: {
                color: 'error',
                dense: true
              },
              on: {
                click: (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  this.$emit('click:delete', action)
                  this.$emit('click:delete-item', action.item)
                }
              }
            },
            ['mdi-delete-outline']
          )
        )
      }

      if (this.$scopedSlots['item.actions.append']) {
        children.push(this.$scopedSlots['item.actions.append'](action))
      }

      return this.$createElement('div', children)
    },

    genDefaultDateRowItem ({ value }) {
      return formatDate(value)
    },

    genDefaultScopedSlot (props) {
      this.genDefaultScopedItemSlots()

      const simpleProps = {
        height: this.height,
        fixedHeader: this.fixedHeader,
        dense: this.dense
      }

      return this.$createElement(
        VSimpleTable,
        {
          props: simpleProps
        },
        [
          this.proxySlot('top', this.genTop(props)),
          this.genCaption(props),
          this.genColgroup(props),
          this.genHeaders(props),
          this.genBody(props),
          this.proxySlot('bottom', this.genFooters(props))
        ]
      )
    },

    genDefaultScopedItemSlots () {
      if (this.hasActionsHeader && !this.$scopedSlots['item.actions']) {
        this.$scopedSlots['item.actions'] = this.genDefaultActionsItem
      }

      if (this.hasCreatedAtHeader && !this.$scopedSlots['item.createdAt']) {
        this.$scopedSlots['item.createdAt'] = this.genDefaultDateRowItem
      }

      if (this.hasUpdateAtHeader && !this.$scopedSlots['item.updatedAt']) {
        this.$scopedSlots['item.updatedAt'] = this.genDefaultDateRowItem
      }
    },

    genTop (props) {
      const top = getSlot(this, 'top', props, true)

      if (top || this.hideDefaultTop) {
        return top
      }

      return [
        this.$createElement(
          VToolbar,
          {
            staticClass: 'mb-6',
            props: {
              color: 'white',
              flat: true
            }
          },
          [
            getSlot(this, 'top.prepend', props) ||
              this.noSearchable ||
              this.$createElement(VSpacer),

            this.noSearchable ||
              this.$createElement(PgTextField, {
                staticClass: 'shrink',
                props: {
                  'append-icon': 'mdi-magnify',
                  clearable: true,
                  'hide-details': true,
                  label: 'Search',
                  'single-line': true,
                  solo: true
                },
                on: {
                  'click:clear': () => {
                    this.searchField = null
                    this.$emit('search', this.searchField)
                  },
                  input: (input) => {
                    this.searchField = input
                  },
                  keydown: ({ keyCode }) => {
                    if (keyCode === 13) {
                      this.$emit('search', this.searchField)
                    }
                  }
                }
              }),

            getSlot(this, 'top.append', props)
          ]
        )
      ]
    },

    createItemProps (item) {
      const props = PgDataIterator.options.methods.createItemProps.call(
        this,
        item
      )
      return Object.assign(props, {
        headers: this.computedHeaders
      })
    },

    genEmpty (originalItemsLength, filteredItemsLength) {
      if (originalItemsLength === 0 && this.loading) {
        const loading = this.$slots.loading || [
          this.$createElement(VSkeletonLoader, {
            staticClass: 'mx-auto',
            props: {
              type: 'table-row-divider@3'
            }
          })
        ]

        return this.genEmptyWrapper(loading)
      } else if (originalItemsLength === 0) {
        const noData = this.$slots['no-data'] || [
          this.$createElement(
            PgBtn,
            {
              props: {
                color: 'primary',
                text: true
              },
              on: {
                click: (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  this.$emit('click:refresh')
                }
              }
            },
            ['Refresh']
          )
        ]

        return this.genEmptyWrapper(noData)
      } else if (filteredItemsLength === 0) {
        const noResults =
          this.$slots['no-results'] || this.$vuetify.lang.t(this.noResultsText)

        return this.genEmptyWrapper(noResults)
      }

      return null
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
