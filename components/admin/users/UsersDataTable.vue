<template>
  <v-container>
    <!-- Add New User Card -->
    <v-row>
      <v-col cols="12">
        <v-card width="100%" class="custom-shadow">
          <v-card-title>
            Users

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-user-manager-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Add new user</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete users.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row v-if="showGraphs" no-gutters>
      <v-col cols="12" md="4">
        <!-- Total Users -->
        <v-card height="350px" class="mx-0 my-2 mr-md-2 custom-shadow">
          <v-card-text class="full-height">
            <label class="text-h5 font-weight-bold">Total Users</label>
            <v-row class="mt-n4 full-height align-content-space-around">
              <v-col cols="12">
                <p class="text-center my-0">
                  <v-icon x-large color="green lighten-1">
                    mdi-menu-up
                  </v-icon>
                  <span class="grey--text">+{{ totalSubscriptions.increment }} New users this week</span> <br>
                </p>
              </v-col>
              <v-col
                class="text-h1"
                cols="12"
              >
                <center>
                  <label class="font-weight-bold total-users">{{ totalSubscriptions.total }}</label>
                </center>
              </v-col>
              <v-col
                class="text-h6"
                cols="12"
              >
                <center>
                  <label class="grey--text">Users using our platform</label>
                </center>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <!-- Total Users Per Plan -->
        <v-card class="mx-0 my-2 mx-md-2 custom-shadow" height="350px">
          <v-card-text>
            <label class="text-h5 font-weight-bold">Total Users per Plan</label>
            <pie-chart :pie-data="usersPerPlan" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <!-- Users per status -->
        <v-card class="mx-0 my-2 ml-md-2 custom-shadow" height="350px">
          <v-card-text>
            <label class="text-h5 font-weight-bold">Users per status</label>
            <pie-chart :pie-data="usersPerStatus" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title v-if="seriesName">
            <label class="font-weight-bold">{{ seriesName }}</label>
            <v-spacer />
          </v-card-title>
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="types"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              top-justify="space-between"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @refresh="refetchUsersData"
              @update:items-per-page="setLimit"
              @update:page="page = $event"
              @edit-item="$router.push({
                name: 'admin-user-manager-editor',
                query: { id: $event.id }
              })"
              @remove-item="remove"
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

              <template v-slot:[`item.actions.prepend`]="{ item }">
                <img class="clickable profile-icon" width="20px;" height="20px;" src="@/assets/svg/eye.svg" @click="goToProfile(item.id)">
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
import PieChart from '@/components/echart/PieChart.vue'

export default {
  name: 'UsersDataTable',

  components: {
    PieChart
  },
  props: {
    showPanel: {
      type: Boolean,
      required: false,
      default: true
    },
    seriesName: {
      type: String,
      required: false,
      default: ''
    },
    paramsSend: {
      type: Object,
      required: false,
      default: () => {}
    },
    showGraphs: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      searchText: null,
      limit: 10,
      page: 1,
      allFilters: false,
      activeFilters: ['firstName', 'lastName'],
      filterList: [
        {
          text: 'First Name',
          value: 'firstName'
        },
        {
          text: 'Last Name',
          value: 'lastName'
        },
        {
          text: 'E-mail',
          value: 'email'
        },
        {
          text: 'Phone Number',
          value: 'phoneNumber'
        },
        {
          text: 'Role',
          value: 'role'
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
        },
        {
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 100
        }
      ],
      usersPerStatus: {
        title: '',
        data: []
      },
      usersPerPlan: {
        title: '',
        data: []
      },
      totalSubscriptions: {
        total: 0,
        increment: 0
      }
    }
  },

  computed: {
    ...mapGetters('admin/users', {
      types: 'rows',
      total: 'total'
    })
  },

  watch: {
    page () {
      this.refetchUsersData()
    },

    limit () {
      this.refetchUsersData()
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

  async created () {
    await this.fetchChartsData()
  },

  mounted () {
    this.refetchUsersData()
  },

  methods: {
    ...mapActions('admin/users', {
      getUsers: 'get',
      deleteUser: 'delete'
    }),

    ...mapActions('admin/dashboard', ['getUserCharts']),

    goToProfile (id) {
      this.$router.push({ name: 'admin-user-manager-profile', query: { id } })
    },

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
      this.refetchUsersData()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchUsersData()
    },

    async refetchUsersData () {
      this.loading = true
      const params = { limit: this.limit, page: this.page }

      if (this.searchText) {
        this.activeFilters.forEach((filter) => {
          params[filter] = this.searchText
        })
      }

      await this.getUsers(params)
      this.loading = false
    },

    remove ({ id, firstName, lastName, email }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete user?',
        message: `Are you sure you want to delete <b>${firstName} ${lastName}' (${email})</b>?`,
        action: async () => {
          await this.deleteUser(id)
          this.refetchUsersData()
        }
      })
    },

    async fetchChartsData () {
      try {
        this.loading = true
        const { usersPerPlan, usersPerStatus, totalSubscriptions } = await this.getUserCharts({})
        this.usersPerPlan = {
          data: usersPerPlan
        }
        this.usersPerStatus = {
          data: usersPerStatus
        }
        this.totalSubscriptions = totalSubscriptions
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-icon {
  display: inline-flex;
  vertical-align: middle;
}
.full-height {
  height: 100% !important;
}
.custom-shadow {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
}
</style>
