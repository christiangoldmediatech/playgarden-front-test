<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Shipping Address

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
              <span class="hidden-xs-only white--text">
                Add new address
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete shippingAddress.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <shipping-address-editor-dialog ref="editor" @saved="refresh(false)" />

            <pg-admin-data-table
              :headers="headers"
              :items="shippingAddress"
              :loading="loading"
              :page.sync="page"
              :no-searchable="false"
              @update:page="page = $event"
              @refresh="refresh(true)"
              @search="onSearch"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'
import ShippingAddressEditorDialog from './ShippingAddressEditorDialog'

export default {
  name: 'ShippingAddressDataTable',

  components: {
    ShippingAddressEditorDialog
  },

  mixins: [onSearch],

  data: vm => ({
    parentId: vm.$route.query.id
      ? parseInt(vm.$route.query.id)
      : null,
    filters: {
      activityTypeId: null
    },
    shippingAddress: [],
    loading: false,
    search: null,
    page: 1,
    headers: [
      {
        text: 'State',
        sortable: true,
        value: 'state'
      },
      {
        text: 'City',
        sortable: true,
        value: 'city'
      },
      {
        text: 'Address 1',
        sortable: true,
        value: 'address1'
      },
      {
        text: 'Address 2',
        sortable: true,
        value: 'address2'
      },
      {
        text: 'Zip Code',
        sortable: true,
        value: 'zipCode'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 100
      }
    ]
  }),

  computed: {},

  created () {
    this.refresh()
  },

  methods: {

    ...mapActions('shipping-address', ['getShippingAddressByUserId']),

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = null
      }

      try {
        this.shippingAddress = await this.getShippingAddressByUserId({
          // name: this.search
          id: this.parentId
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete patch?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deletePatch(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
