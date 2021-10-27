<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Activity Types

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

              <span
                class="hidden-xs-only white--text"
              >
                Add new activity type
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete activity types.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <activity-type-editor-dialog ref="editor" />

            <pg-admin-data-table
              :headers="headers"
              :items="types"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @search="refetchTypes"
              @refresh="refetchTypes"
              @search-text-cleared="refetchTypes"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`item.color`]="{ item }">
                <v-avatar
                  color="black"
                  size="32"
                >
                  <v-avatar
                    :color="item.color"
                    size="28"
                  />
                </v-avatar>
              </template>

              <template v-slot:[`item.icon`]="{ item }">
                <img
                  v-if="item.icon && item.icon !== '0'"
                  :src="item.icon"
                  width="32px"
                >
                <span v-else>
                  N/A
                </span>
              </template>

              <template v-slot:[`item.type`]="{ item }">
                <span class="text-capitalize">
                  {{ itemTypeString(item.type) }}
                </span>
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
import ActivityTypeEditorDialog from './ActivityTypeEditorDialog'

export default {
  name: 'ActivityTypeDataTable',

  components: {
    ActivityTypeEditorDialog
  },
  data () {
    return {
      loading: false,
      page: 1,
      headers: [
        {
          text: 'Color',
          align: 'start',
          sortable: true,
          value: 'color'
        },
        {
          text: 'Icon',
          align: 'start',
          sortable: true,
          value: 'icon'
        },
        {
          text: 'Activity Type Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Type',
          align: 'start',
          sortable: true,
          value: 'type'
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
          value: 'actions',
          width: 100
        }
      ]
    }
  },

  computed: {
    ...mapGetters('admin/activity', ['types'])
  },
  mounted () {
    this.refetchTypes()
  },
  methods: {
    ...mapActions('admin/activity', ['getTypes', 'deleteType']),

    itemTypeString (types) {
      const list = []
      Object.keys(types).forEach((key) => {
        if (types[key]) {
          list.push(key)
        }
      })

      return list.length ? list.join(' | ') : 'N/A'
    },

    async refetchTypes (searchText) {
      this.loading = true
      await this.getTypes({
        name: searchText
      })
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete activity type?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteType(id)
          this.refetchTypes()
        }
      })
    }
  }
}
</script>
