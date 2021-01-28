<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Parents
            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              @click.stop="exportList"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Export</span>
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
              :items="types"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              :action="action"
              top-justify="space-between"
              @search="onSearch"
              @refresh="refresh(true)"
              @update:items-per-page="setLimit"
              @update:page="page = $event"
              @edit-item="
                $router.push({
                  name: 'admin-user-manager-specialists-editor',
                  query: { id: $event.id }
                })
              "
            >
              <template v-slot:[`top.prepend`]>
                <v-col class="fkex-shrink-1 flex-grow-0">
                  <v-icon class="my-4 mx-1" color="accent">
                    mdi-tune
                  </v-icon>
                </v-col>

                <v-col cols="12" md="7" class="flex-shrink-0 flex-grow-1">
                  <v-row no-gutters>
                    <v-checkbox
                      class="mx-1 my-1 pa-0"
                      color="primary darken-2"
                      hide-details
                      :input-value="allFilters"
                      label="All"
                      @click.stop="toggleAll"
                    />

                    <v-checkbox
                      v-for="(item, i) in filterList"
                      :key="`filter-item-${i}`"
                      v-model="activeFilters"
                      class="mx-1 my-1 pa-0"
                      color="primary darken-2"
                      hide-details
                      :label="item.text"
                      multiple
                      :value="item.value"
                    />
                  </v-row>
                </v-col>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'

export default {
  name: 'ParentsDataTable',

  mixins: [onSearch],

  data () {
    return {
      loading: false,
      action: true,
      search: '',
      limit: 10,
      page: 1,
      allFilters: false,
      activeFilters: ['firstName', 'lastName'],
      filterList: [
        {
          text: 'First Name',
          value: 'user.firstName'
        },
        {
          text: 'Last Name',
          value: 'user.lastName'
        },
        {
          text: 'E-mail',
          value: 'user.email'
        },
        {
          text: 'Phone Number',
          value: 'user.phoneNumber'
        }
      ],
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'fullName'
        },
        {
          text: 'E-mail',
          align: 'start',
          sortable: false,
          value: 'email'
        },
        {
          text: 'Phone',
          align: 'start',
          sortable: false,
          value: 'phoneNumber'
        },
        {
          text: 'Role',
          align: 'start',
          sortable: false,
          value: 'role.name'
        },
        {
          text: 'Created',
          align: 'start',
          sortable: false,
          value: 'createdAt'
        },
        {
          text: 'Last Updated',
          align: 'start',
          sortable: false,
          value: 'updatedAt'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('admin/users', {
      types: 'rows',
      total: 'total'
    }),
    ...mapGetters('admin/roles', {
      roles: 'rows'
    })
  },

  watch: {
    page () {
      this.refresh()
    },

    limit () {
      this.refresh()
    },

    activeFilters (val) {
      if (val.length === 0 || val.length !== this.filterList.length) {
        this.allFilters = false
      }

      if (val.length === this.filterList.length) {
        this.allFilters = true
      }
    }
  },

  methods: {
    ...mapActions('admin/users', {
      getUsers: 'get'
    }),
    ...mapActions('admin/users', {
      exportParents: 'exportParents'
    }),
    ...mapActions('admin/roles', {
      getRoles: 'get'
    }),

    toggleAll () {
      this.allFilters = !this.allFilters

      if (this.allFilters) {
        this.filterList.forEach((filter) => {
          if (!this.activeFilters.includes(filter.value)) {
            this.activeFilters.push(filter.value)
          }
        })
      } else {
        this.activeFilters = []
      }
    },

    setLimit (limit) {
      if (limit > 0) {
        this.limit = limit
      } else {
        this.limit = 0
      }
    },

    async refresh (clear = false) {
      const id = 3
      this.loading = true
      const params = { limit: this.limit, page: this.page, roleId: id }

      if (clear) {
        this.search = ''
      } else {
        this.activeFilters.forEach((filter) => {
          params[filter] = this.search
        })
      }

      await this.getUsers(params)
      this.loading = false
    },

    async exportList () {
      await this.exportParents()
      this.$snotify.success('Report created succesfully! Check your email to get it', {
        timeout: 6000
      })
    }
  }
}
</script>
