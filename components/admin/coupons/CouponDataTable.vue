<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Coupons

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              @click.stop="$refs.editor.open"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>
              <span class="hidden-xs-only white--text">Add new coupon</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete coupons.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <coupon-editor-dialog
              ref="editor"
              @saved="refetchCouponsData"
            />

            <pg-admin-data-table
              :headers="headers"
              :items="coupons"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @refresh="refetchCouponsData"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`item.image`]="{ item }">
                <img v-if="item.image" :src="item.image" width="32px">

                <span v-else>
                  N/A
                </span>
              </template>
              <template v-slot:[`item.actions.prepend`]="{ item }">
                <nuxt-link :to="getLocationData(item)">
                  <v-icon
                    color="accent"
                    dense
                  >
                    mdi-account
                  </v-icon>
                </nuxt-link>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import CouponEditorDialog from './CouponEditorDialog'

export default {
  name: 'CouponDataTable',

  components: {
    CouponEditorDialog
  },
  data () {
    return {
      coupons: [],
      searchText: null,
      loading: false,
      page: 1,
      query: null,
      headers: [
        {
          text: 'Code Promotion',
          align: 'start',
          sortable: true,
          value: 'promotion_code'
        },
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Duration',
          align: 'start',
          sortable: true,
          value: 'duration'
        },
        {
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 100
        }
      ]
    }
  },
  mounted () {
    this.refetchCouponsData()
  },
  methods: {
    ...mapActions('coupons', ['getCoupons', 'deleteCoupon']),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchCouponsData()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchCouponsData()
    },
    async refetchCouponsData () {
      this.loading = true
      const code = this.searchText
      this.query = { active: true, ...code && { code } }

      try {
        this.coupons = await this.getCoupons(this.query)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete coupon?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteCoupon(id)
          await this.refetchCouponsData()
        }
      })
    },
    getLocationData (item) {
      return {
        name: 'admin-user-manager-coupon-users',
        query: { couponName: item.name }
      }
    }
  }
}
</script>
