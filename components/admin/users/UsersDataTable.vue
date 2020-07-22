<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
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
              <span class="hidden-xs-only">Add new user</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete users.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <v-data-table
              dense
              :headers="headers"
              hide-default-footer
              :items="types"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              @update:items-per-page="setLimit"
              @update:page="page = $event"
            >
              <template v-slot:top>
                <v-container flui>
                  <v-row color="white" align="center">
                    <v-icon class="my-1" color="accent">
                      mdi-tune
                    </v-icon>
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
                    <v-spacer />
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      clearable
                      hide-details
                      label="Search"
                      single-line
                      solo
                      @keydown.enter="refresh(false)"
                    />
                  </v-row>
                </v-container>
              </template>

              <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt | formatDate }}
              </template>

              <template v-slot:item.updatedAt="{ item }">
                {{ item.updatedAt | formatDate }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon
                  color="#81A1F7"
                  dense
                  @click.stop="$router.push({ name: 'admin-user-manager-editor', query: { id: item.id } })"
                >
                  mdi-pencil-outline
                </v-icon>
                <v-icon
                  color="#d30909"
                  dense
                  @click="remove(item)"
                >
                  mdi-delete-outline
                </v-icon>
              </template>

              <template v-slot:no-data>
                <v-btn
                  color="primary"
                  text
                  @click="refresh(true)"
                >
                  Refresh
                </v-btn>
              </template>

              <template v-slot:loading>
                <v-skeleton-loader
                  class="mx-auto"
                  type="table-row-divider@3"
                />
              </template>

              <template v-slot:footer="{ props }">
                <v-container fluid>
                  <v-row align="center" justify="end">
                    <v-icon
                      class="clickable mr-2"
                      color="green"
                      :disabled="props.pagination.page === 1 || loading"
                      x-small
                      @click.stop="page--"
                      v-text="'mdi-less-than'"
                    />

                    <template v-for="i in props.pagination.pageCount">
                      <span :key="`footer-page-number-${i}`" :class="['font-weight-normal', { 'accent--text text--darken-1': props.pagination.page === i, 'clickable': props.pagination.page !== i }]" @click.stop="page = i">
                        {{ i }}
                      </span>
                      <span v-if="i !== props.pagination.pageCount" :key="`footer-page-dot-${i}`" class="font-weight-normal mx-1">
                        &centerdot;
                      </span>
                    </template>

                    <v-icon
                      class="clickable ml-2"
                      color="green"
                      :disabled="props.pagination.page === props.pagination.pageCount || loading"
                      x-small
                      @click.stop="page++"
                      v-text="'mdi-greater-than'"
                    />
                  </v-row>
                </v-container>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UsersDataTable',

  data () {
    return {
      loading: false,
      search: '',
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
          text: '',
          align: 'right',
          sortable: false,
          value: 'actions'
        }
      ]
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
      getUsers: 'get',
      deleteUser: 'delete'
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
      this.loading = true
      const params = { limit: this.limit, page: this.page }

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

    remove ({ id, firstName, lastName, email }) {
      this.$nuxt.$emit('open-admin-prompt', {
        title: 'Delete user?',
        message: `Are you sure you wish to delete user '${firstName} ${lastName}' (${email})?`,
        action: async () => {
          await this.deleteUser(id)
          this.refresh()
        }
      })
    }
  }
}
</script>
