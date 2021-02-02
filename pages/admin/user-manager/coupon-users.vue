<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Coupon - {{ couponName }}

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
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="users"
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
              <!-- <template v-slot:[`item.actions.prepend`]="{ item }">
                <nuxt-link
                  :to="{
                    name: 'admin-user-manager-users',
                    params: { name: item.id }
                  }"
                >
                  <v-icon color="accent" dense>
                    mdi-play
                  </v-icon>
                </nuxt-link>
              </template> -->
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

export default {
  name: 'CouponUsers',

  layout: 'admin',

  components: {},

  mixins: [onSearch],

  data () {
    return {
      users: [],
      loading: false,
      search: null,
      page: 1,
      query: null,
      headers: [
        {
          text: 'First Name',
          align: 'start',
          sortable: true,
          value: 'firstName'
        },
        {
          text: 'Last Name',
          align: 'start',
          sortable: true,
          value: 'lastName'
        },
        {
          text: 'E-mail',
          align: 'start',
          sortable: true,
          value: 'email'
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

  computed: {
    couponName () {
      return this.$route.query.couponName
    }
  },

  watch: {
    couponName () {
      if (!this.loading) {
        this.refresh()
      }
    }
  },

  created () {
    this.refresh()
  },

  methods: {
    ...mapActions('coupons', ['getCouponsWithUsers', 'deleteCouponSubscription']),

    async refresh (clear = false) {
      this.loading = true
      this.query = { name: this.couponName }

      try {
        this.users = await this.getCouponsWithUsers(this.query)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, firstName, lastName }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete coupon on client?',
        message: `Are you sure you want to delete coupon on <b>${firstName} ${lastName}</b>?`,
        action: async () => {
          await this.deleteCouponSubscription(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
