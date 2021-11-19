<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Specialists
            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-user-manager-specialists-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Add new specialist</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete specialists.
          </v-card-text>
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
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @refresh="refetchSpeciallistsData"
              @update:items-per-page="setLimit"
              @update:page="page = $event"
              @edit-item="
                $router.push({
                  name: 'admin-user-manager-specialists-editor',
                  query: { id: $event.id }
                })
              "
              @remove-item="remove"
              @action-item="playDates"
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

export default {
  name: 'SpecialistsDataTable',
  data () {
    return {
      loading: false,
      action: true,
      searchText: null,
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
          value: 'user.fullName'
        },
        {
          text: 'E-mail',
          align: 'start',
          sortable: false,
          value: 'user.email'
        },
        {
          text: 'Phone',
          align: 'start',
          sortable: false,
          value: 'user.phoneNumber'
        },
        {
          text: 'Profile',
          align: 'start',
          sortable: false,
          value: 'profile'
        },
        {
          text: 'Profession',
          align: 'start',
          sortable: false,
          value: 'profession'
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
    ...mapGetters('admin/specialists', {
      types: 'rows',
      total: 'total'
    }),
    ...mapGetters('admin/roles', {
      roles: 'rows'
    })
  },

  watch: {
    page () {
      this.refetchSpeciallistsData()
    },

    limit () {
      this.refetchSpeciallistsData()
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
  mounted () {
    this.refetchSpeciallistsData()
  },

  methods: {
    ...mapActions('admin/specialists', {
      getSpecialists: 'get',
      deleteSpecialists: 'delete'
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
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchSpeciallistsData()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchSpeciallistsData()
    },
    async refetchSpeciallistsData () {
      await this.getRoles('SPECIALISTS')
      const { id } = this.roles[0]
      this.loading = true
      const params = { limit: this.limit, page: this.page, roleId: id }

      if (this.searchText) {
        this.activeFilters.forEach((filter) => {
          params[filter] = this.searchText
        })
      }

      await this.getSpecialists(params)
      this.loading = false
    },

    remove ({ id, user }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete user?',
        message: `Are you sure you wish to delete user '${user.firstName} ${user.lastName}' (${user.email})?`,
        action: async () => {
          await this.deleteSpecialists(id)
          this.refetchSpeciallistsData()
        }
      })
    },

    playDates (item) {
      this.$router.push({
        name: 'admin-playdates',
        query: { specialistId: item.id }
      })
    }
  }
}
</script>
