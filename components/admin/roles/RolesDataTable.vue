<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Role Management

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
                Add new role
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete roles.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <role-editor-dialog ref="editor" />

            <pg-admin-data-table
              :headers="headers"
              hide-default-footer
              :items="types"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @refresh="refresh(true)"
              @search="onSearch"
              @edit-item="$refs.editor.open($event)"
              @remove-item="remove"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'
import RoleEditorDialog from './RoleEditorDialog'

export default {
  name: 'RolesDataTable',

  components: {
    RoleEditorDialog
  },

  mixins: [onSearch],

  data () {
    return {
      loading: false,
      search: '',
      page: 1,
      headers: [
        {
          text: 'Role',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Section',
          align: 'start',
          sortable: true,
          value: 'section'
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
      ]
    }
  },

  computed: {
    ...mapGetters('admin/roles', {
      types: 'rows'
    })
  },

  methods: {
    ...mapActions('admin/roles', {
      getRoles: 'get',
      deleteRole: 'delete'
    }),

    async refresh (clear = false) {
      this.loading = true
      if (clear) {
        this.search = ''
      }
      await this.getRoles(this.search)
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete role?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteRole(id)
          this.refresh()
        }
      })
    }
  }
}
</script>
