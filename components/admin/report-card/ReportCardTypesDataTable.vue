<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Report Card Types

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
                Add new report card type
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete report card types.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <report-card-type-editor-dialog ref="editor" />

            <pg-admin-data-table
              :headers="headers"
              :items="types"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @refresh="refetchRefetchReportCardTypes"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
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
import ReportCardTypeEditorDialog from './ReportCardTypeEditorDialog'

export default {
  name: 'ReportCardTypesDataTable',

  components: {
    ReportCardTypeEditorDialog
  },
  data () {
    return {
      loading: false,
      searchText: null,
      page: 1,
      headers: [
        {
          text: 'Report Card Type',
          align: 'start',
          sortable: true,
          value: 'name'
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
    ...mapGetters('admin/report-card', ['types'])
  },
  mounted () {
    this.refetchRefetchReportCardTypes()
  },
  methods: {
    ...mapActions('admin/report-card', ['getTypes', 'deleteType']),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchRefetchReportCardTypes()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchRefetchReportCardTypes()
    },
    async refetchRefetchReportCardTypes () {
      this.loading = true
      await this.getTypes(this.searchText)
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete report card type?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteType(id)
          this.refetchRefetchReportCardTypes()
        }
      })
    }
  }
}
</script>
