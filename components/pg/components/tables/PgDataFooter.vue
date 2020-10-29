<script>
import { VBtn } from 'vuetify/lib/components/VBtn'
import { VDataFooter } from 'vuetify/lib/components/VDataIterator'
import { VIcon } from 'vuetify/lib/components/VIcon'

import PgPagination from '../PgPagination'
import PgSelect from '../form-inputs-controls/PgSelect'

export default {
  name: 'PgDataFooter',

  mixins: [VDataFooter],

  props: {
    circle: Boolean,

    color: {
      type: String,
      default: 'accent--text'
    },

    hidePaginationNumbers: Boolean,

    showItemsPerPage: Boolean,

    showPaginationInfo: Boolean,

    totalVisible: {
      type: [Number, String],
      default: 7
    }
  },

  methods: {
    genItemsPerPageSelect () {
      if (!this.showItemsPerPage) {
        return null
      }

      let value = this.options.itemsPerPage
      const computedIPPO = this.computedDataItemsPerPageOptions
      if (computedIPPO.length <= 1) {
        return null
      }
      if (!computedIPPO.find(ippo => ippo.value === value)) {
        value = computedIPPO[0]
      }
      return this.$createElement(
        'div',
        {
          staticClass: 'v-data-footer__select'
        },
        [
          this.$vuetify.lang.t(this.itemsPerPageText),
          this.$createElement(PgSelect, {
            attrs: {
              'aria-label': this.itemsPerPageText
            },
            props: {
              disabled: this.disableItemsPerPage,
              items: computedIPPO,
              value,
              hideDetails: true,
              auto: true,
              minWidth: '75px'
            },
            on: {
              input: this.onChangeItemsPerPage
            }
          })
        ]
      )
    },

    genPaginationInfo () {
      if (!this.showPaginationInfo) {
        return null
      }

      let children = ['–']

      if (this.pagination.itemsLength && this.pagination.itemsPerPage) {
        const itemsLength = this.pagination.itemsLength
        const pageStart = this.pagination.pageStart + 1
        const pageStop =
          itemsLength < this.pagination.pageStop || this.pagination.pageStop < 0
            ? itemsLength
            : this.pagination.pageStop
        children = this.$scopedSlots['page-text']
          ? [
            this.$scopedSlots['page-text']({
              pageStart,
              pageStop,
              itemsLength
            })
          ]
          : [
            this.$vuetify.lang.t(
              this.pageText,
              pageStart,
              pageStop,
              itemsLength
            )
          ]
      }

      return this.$createElement(
        'div',
        {
          class: 'v-data-footer__pagination'
        },
        children
      )
    },

    genIcon (click, disabled, label, icon) {
      return this.$createElement(
        VBtn,
        {
          props: {
            color: 'primary',
            disabled: disabled || this.disablePagination,
            icon: true,
            text: true
          },
          staticClass: 'mt-3',
          on: {
            click
          },
          attrs: {
            'aria-label': label
          }
        },
        [this.$createElement(VIcon, icon)]
      )
    },

    genIcons () {
      const before = []
      const after = []

      if (this.hidePaginationNumbers) {
        before.push(
          this.genIcon(
            this.onPreviousPage,
            this.options.page === 1,
            this.$vuetify.lang.t('$vuetify.dataFooter.prevPage'),
            this.$vuetify.rtl ? this.nextIcon : this.prevIcon
          )
        )
        after.push(
          this.genIcon(
            this.onNextPage,
            this.disableNextPageIcon,
            this.$vuetify.lang.t('$vuetify.dataFooter.nextPage'),
            this.$vuetify.rtl ? this.prevIcon : this.nextIcon
          )
        )

        return [
          this.$createElement(
            'div',
            {
              staticClass: 'v-data-footer__icons-before'
            },
            before
          ),
          this.showCurrentPage &&
            this.$createElement('span', [this.options.page.toString()]),
          this.$createElement(
            'div',
            {
              staticClass: 'v-data-footer__icons-after'
            },
            after
          )
        ]
      }

      return [
        this.$createElement(PgPagination, {
          props: {
            circle: this.circle,
            color: this.color,
            disabled: this.disablePagination,
            length: this.pagination.pageCount,
            nextIcon: this.nextIcon,
            prevIcon: this.prevIcon,
            totalVisible: this.totalVisible,
            value: this.options.page
          },
          on: {
            previous: this.onPreviousPage,
            input: page => this.updateOptions({ page }),
            next: this.onNextPage
          }
        })
      ]
    }
  },

  render () {
    return this.$createElement(
      'div',
      {
        staticClass: 'v-data-footer pr-0'
      },
      [this.genItemsPerPageSelect(), this.genPaginationInfo(), this.genIcons()]
    )
  }
}
</script>
