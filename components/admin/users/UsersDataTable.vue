<template>
  <v-data-table
    :headers="headers"
    :items="types"
    :loading="loading"
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
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="shrink"
          clearable
          hide-details
          label="Search"
          single-line
          @keydown.enter="refresh(false)"
        />
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
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
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'fullName'
        },
        {
          text: 'E-mail',
          align: 'start',
          sortable: true,
          value: 'email'
        },
        {
          text: 'Phone',
          align: 'start',
          sortable: true,
          value: 'phoneNumber'
        },
        {
          text: 'Role',
          align: 'start',
          sortable: true,
          value: 'role.name'
        },
        {
          text: 'Actions',
          align: 'right',
          sortable: false,
          value: 'actions'
        }
      ]
    }
  },

  computed: {
    types () {
      return this.$store.getters['admin/users/rows']
    }
  },

  methods: {
    async refresh (clear = false) {
      this.loading = true
      if (clear) {
        this.search = ''
      }
      await this.$store.dispatch('admin/users/get', this.search)
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
