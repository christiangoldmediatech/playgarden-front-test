<template>
  <v-data-table
    dense
    :headers="headers"
    :items="types"
    :loading="loading"
    :server-items-length="total"
    @update:items-per-page="setLimit"
    @update:page="page = $event"
  >
    <template v-slot:top>
      <v-toolbar color="white" flat>
        <template v-if="$vuetify.breakpoint.mdAndUp">
          <v-toolbar-title>
            Rows
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
        </template>
        <v-btn
          class="mr-2"
          color="primary darken-1"
          dark
          :icon="$vuetify.breakpoint.xs"
          small
          @click.stop="$router.push({ name: 'admin-users-editor' })"
        >
          <v-icon class="hidden-sm-and-up">
            mdi-plus-circle
          </v-icon>
          <v-icon class="hidden-xs-only">
            mdi-plus
          </v-icon>
          <span class="hidden-xs-only">Create</span>
        </v-btn>
        <v-spacer />
        <v-row class="shrink">
          <v-text-field
            v-model="search"
            clearable
            hide-details
            label="Search"
            single-line
            @keydown.enter="refresh(false)"
          >
            <template v-slot:append>
              <v-menu>
                <template v-slot:activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn
                        v-bind="attrs"
                        color="primary"
                        icon
                        small
                        v-on="{ ...tooltip, ...menu }"
                      >
                        <v-icon>
                          mdi-filter
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Select filters</span>
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item-group
                    v-model="activeFilters"
                    multiple
                  >
                    <v-list-item
                      v-for="(item, i) in filterList"
                      :key="`filter-item-${i}`"
                      :value="item.value"
                    >
                      <template v-slot:default="{ active, toggle }">
                        <v-list-item-action>
                          <v-checkbox
                            color="primary darken-2"
                            :input-value="active"
                            :true-value="item.value"
                            @click="toggle"
                          />
                        </v-list-item-action>

                        <v-list-item-content>
                          <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </template>
          </v-text-field>
        </v-row>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-row>
        <v-icon
          class="mr-2"
          color="yellow darken-2"
          @click.stop="$router.push({ name: 'admin-users-editor', query: { id: item.id } })"
        >
          mdi-pencil-circle
        </v-icon>
        <v-icon
          color="red"
          @click="remove(item)"
        >
          mdi-delete-circle
        </v-icon>
      </v-row>
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
  </v-data-table>
</template>

<script>
export default {
  name: 'UsersDataTable',

  data () {
    return {
      loading: false,
      search: '',
      limit: 10,
      page: 1,
      activeFilters: [],
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
          text: 'Actions',
          align: 'end',
          sortable: false,
          value: 'actions'
        }
      ]
    }
  },

  computed: {
    types () {
      return this.$store.getters['admin/users/rows']
    },

    total () {
      return this.$store.getters['admin/users/total']
    }
  },

  watch: {
    page () {
      this.refresh()
    },

    limit () {
      this.refresh()
    }
  },

  methods: {
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

      await this.$store.dispatch('admin/users/get', params)
      this.loading = false
    },

    remove ({ id, firstName, lastName, email }) {
      this.$nuxt.$emit('open-admin-prompt', {
        title: 'Delete user?',
        message: `Are you sure you wish to delete user '${firstName} ${lastName}' (${email})?`,
        action: async () => {
          await this.$store.dispatch('admin/users/delete', id)
          this.refresh()
        }
      })
    }
  }
}
</script>
