<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Coupon - {{ couponName }}

            <v-spacer />
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <v-data-table
              :headers="headers"
              hide-default-footer
              :items="users"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="goToProfile(item.id)">
                  <v-icon color="accent" dense>
                    mdi-eye
                  </v-icon>
                </v-btn>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary" text @click="refetchCouponsDataWithUsers">
                  Refresh
                </v-btn>
              </template>

              <template v-slot:loading>
                <v-skeleton-loader class="mx-auto" type="table-row-divider@3" />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CouponUsers',
  layout: 'admin',
  components: {},
  data () {
    return {
      users: [],
      loading: false,
      searchText: null,
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
        this.refetchCouponsDataWithUsers()
      }
    }
  },

  created () {
    this.refetchCouponsDataWithUsers()
  },

  methods: {
    ...mapActions('coupons', ['getCouponsWithUsers']),

    goToProfile (id) {
      this.$router.push({ name: 'admin-user-manager-profile', query: { id } })
    },

    async refetchCouponsDataWithUsers () {
      this.loading = true
      this.query = { name: this.couponName }

      try {
        this.users = await this.getCouponsWithUsers(this.query)
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
