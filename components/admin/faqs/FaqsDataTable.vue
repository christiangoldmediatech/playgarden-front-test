<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            FAQ

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
                Add new FAQ
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete FAQs.
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
              :items="faqs"
              :loading="loading"
              :page.sync="page"
              @click:delete-item="remove($event)"
              @click:edit-item="$refs.editor.open(null, $event)"
              @click:refresh="refetchFAQs"
              @search="handleSearchRequest"
              @update:page="page = $event"
            >
              <template v-slot:top.prepend>
                <pg-select
                  v-model="filters.faqsCategoryId"
                  clearable
                  hide-details
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  label="Category"
                  solo-labeled
                  @change="handleChangeInCategorySelection"
                />

                <v-spacer />
              </template>

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
      @saved="refetchFAQs"
    />
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import FaqsEditorDialog from './FaqsEditorDialog'

export default {
  name: 'FaqsDataTable',
  components: {
    FaqsEditorDialog
  },
  data () {
    return {
      categories: [],
      searchText: null,
      faqs: [],
      loading: false,
      filters: {
        faqsCategoryId: null
      },
      page: 1,
      headers: [
        {
          text: 'Question',
          sortable: true,
          value: 'question'
        },
        {
          text: 'Category',
          sortable: true,
          value: 'faqsCategory.name'
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

  async created () {
    try {
      this.categories = await this.getFAQsCategories()
    } catch (e) {
    } finally {
      this.loading = false
    }
  },
  mounted () {
    this.refetchFAQs()
  },
  methods: {
    ...mapActions('faqs', ['deleteFAQs', 'getFAQs']),
    ...mapActions('faqs-categories', ['getFAQsCategories']),
    handleSearchRequest (searchText) {
      this.searchText = searchText
      this.refetchFAQs()
    },
    handleChangeInCategorySelection () {
      this.refetchFAQs()
    },
    async refetchFAQs () {
      this.loading = true
      const question = this.searchText
      try {
        this.faqs = await this.getFAQs({
          ...question && { question },
          faqsCategoryId: this.filters.faqsCategoryId || null
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete FAQ?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteFAQs(id)
          await this.refetchFAQs()
        }
      })
    }
  }
}
</script>
