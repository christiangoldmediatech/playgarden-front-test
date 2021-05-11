<script>
import { VIcon } from 'vuetify/lib/components/VIcon'
import { VPagination } from 'vuetify/lib/components/VPagination'

export default {
  name: 'PgPagination',

  mixins: [VPagination],

  props: {
    flat: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    genIcon (h, icon, disabled, fn, label) {
      return h('li', [
        h(
          'button',
          {
            staticClass: 'v-pagination__navigation',
            class: {
              'v-pagination__navigation--disabled': disabled,
              'elevation-0': this.flat
            },
            attrs: {
              type: 'button',
              'aria-label': label
            },
            on: disabled
              ? {}
              : {
                  click: fn
                }
          },
          [
            h(
              VIcon,
              {
                props: {
                  color: disabled ? '' : 'primary'
                }
              },
              [icon]
            )
          ]
        )
      ])
    },

    genItem (h, i) {
      const color = i === this.value && (this.color || 'primary')
      const isCurrentPage = i === this.value
      const ariaLabel = isCurrentPage
        ? this.currentPageAriaLabel
        : this.pageAriaLabel
      return h(
        'button',
        this.setBackgroundColor(color, {
          staticClass: 'v-pagination__item',
          class: {
            'v-pagination__item--active': i === this.value,
            'elevation-0': this.flat
          },
          attrs: {
            type: 'button',
            'aria-current': isCurrentPage,
            'aria-label': this.$vuetify.lang.t(ariaLabel, i)
          },
          on: {
            click: () => this.$emit('input', i)
          }
        }),
        [i.toString()]
      )
    },

    genItems (h) {
      return this.items.map((i, index) => {
        return h(
          'li',
          {
            key: index
          },
          [
            isNaN(Number(i))
              ? [
                  h(
                    'span',
                    {
                      class: 'v-pagination__more'
                    },
                    [i.toString()]
                  ),
                  '·'
                ]
              : [this.genItem(h, i), i < this.length ? '·' : null]
          ]
        )
      })
    }
  }
}
</script>
