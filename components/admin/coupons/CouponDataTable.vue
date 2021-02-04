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
            <coupon-editor-dialog ref="editor" @saved="refresh(false)" />

            <pg-admin-data-table
              :headers="headers"
              :items="coupons"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @search="onSearch"
              @refresh="refresh(true)"
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
                <nuxt-link
                  :to="{
                    name: 'admin-user-manager-coupon-users',
                    query: { couponName: item.name }
                  }"
                >
                  <v-icon color="accent" dense>
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
import onSearch from '@/mixins/OnSearchMixin.js'
import CouponEditorDialog from './CouponEditorDialog'

export default {
  name: 'CouponDataTable',

  components: {
    CouponEditorDialog
  },

  mixins: [onSearch],

  data () {
    return {
      coupons: [],
      loading: false,
      search: null,
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

  methods: {
    ...mapActions('coupons', ['getCoupons', 'deleteCoupon']),

    async refresh (clear = false) {
      this.loading = true
      this.query = { active: true, code: this.search }
      if (clear) {
        this.search = null
      }

      if (!this.search) {
        delete this.query.code
      }

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
          await this.refresh()
        }
      })
    }
  }
}
</script>
