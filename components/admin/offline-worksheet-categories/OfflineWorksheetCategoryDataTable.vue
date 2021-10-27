<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Offline Worksheet Categories

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
                Add new offline worksheet category
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete offline worksheet categories.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <offline-worksheet-category-editor-dialog
              ref="editor"
              @saved="refetchOfflineWorksheetCategories"
            />

            <pg-admin-data-table
              :headers="headers"
              :items="offlineWorksheetCategories"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @refresh="refetchOfflineWorksheetCategories"
              @search-text-cleared="handleSearchTextClearance"
              @search="handleSearch"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`item.color`]="{ item }">
                <v-avatar color="black" size="32">
                  <v-avatar :color="item.color" size="28" />
                </v-avatar>
              </template>

              <template v-slot:[`item.icon`]="{ item }">
                <img v-if="item.icon" :src="item.icon" width="32px">

                <span v-else>
                  N/A
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
import { mapActions } from 'vuex'
import OfflineWorksheetCategoryEditorDialog from './OfflineWorksheetCategoryEditorDialog'

export default {
  name: 'OfflineWorksheetCategoryDataTable',

  components: {
    OfflineWorksheetCategoryEditorDialog
  },
  data: () => ({
    offlineWorksheetCategories: [],
    loading: false,
    searchText: null,
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
        text: 'Category',
        align: 'start',
        sortable: true,
        value: 'category'
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
        value: 'actions'
      }
    ]
  }),
  mounted () {
    this.refetchOfflineWorksheetCategories()
  },
  methods: {
    ...mapActions('offline-worksheet-categories', [
      'getOfflineWorksheetCategories',
      'deleteOfflineWorksheetCategory'
    ]),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchOfflineWorksheetCategories()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchOfflineWorksheetCategories()
    },
    async refetchOfflineWorksheetCategories () {
      this.loading = true
      const category = this.searchText

      try {
        this.offlineWorksheetCategories = await this.getOfflineWorksheetCategories({ ...category && { category } }
        )
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete offline worksheet category?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteOfflineWorksheetCategory(id)
          await this.refetchOfflineWorksheetCategories()
        }
      })
    }
  }
}
</script>
