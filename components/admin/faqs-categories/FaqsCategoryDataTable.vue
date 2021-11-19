<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            FAQ Categories

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
                Add new FAQ category
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete FAQ categories.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <pg-data-table
              :headers="headers"
              :items="categories"
              :loading="loading"
              :page.sync="page"
              @click:delete-item="remove($event)"
              @click:edit-item="$refs.editor.open(null, $event)"
              @click:refresh="refetchFAQCategories"
              @search="handleSearch"
              @update:page="page = $event"
            >
              <template v-slot:item.color="{ item }">
                <v-avatar color="black" size="32">
                  <v-avatar :color="item.color" size="28" />
                </v-avatar>
              </template>

              <template v-slot:item.icon="{ item }">
                <img
                  v-if="item.icon && item.icon !== '0'"
                  :src="item.icon"
                  width="32px"
                >
                <span v-else>
                  N/A
                </span>
              </template>
            </pg-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <faqs-editor-dialog
      ref="editor"
      @saved="refetchFAQCategories"
    />
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import FaqsEditorDialog from './FaqsCategoryEditorDialog'

export default {
  name: 'FaqsCategoryDataTable',

  components: {
    FaqsEditorDialog
  },
  data () {
    return {
      categories: [],
      loading: false,
      searchText: '',
      page: 1,
      headers: [
        {
          text: 'Color',
          sortable: true,
          value: 'color'
        },
        {
          text: 'Icon',
          sortable: true,
          value: 'icon'
        },
        {
          text: 'Name',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Description',
          sortable: true,
          value: 'description'
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
  mounted () {
    this.refetchFAQCategories()
  },
  methods: {
    ...mapActions('faqs-categories', [
      'deleteFAQsCategory',
      'getFAQsCategories'
    ]),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchFAQCategories()
    },
    async refetchFAQCategories () {
      this.loading = true

      const name = this.searchText

      try {
        this.categories = await this.getFAQsCategories({ ...name && { name } })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete FAQ category?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteFAQsCategory(id)
          await this.refetchFAQCategories()
        }
      })
    }
  }
}
</script>
