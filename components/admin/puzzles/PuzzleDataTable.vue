<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Puzzles

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
                Add new puzzle
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete puzzles.
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
              :items="puzzles"
              :loading="loading"
              :page.sync="pagination.page"
              :server-items-length="pagination.total"
              @click:delete-item="remove($event)"
              @click:edit-item="$refs.editor.open(null, $event)"
              @click:refresh="refetchPuzzles"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @update:page="pagination.page = $event"
            >
              <template v-slot:item.image="{ item }">
                <img v-if="item.image" :src="item.image" width="32px">

                <span v-else>
                  N/A
                </span>
              </template>
            </pg-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <puzzle-editor-dialog
      ref="editor"
      @saved="refetchPuzzles"
    />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import paginable from '@/utils/mixins/paginable'
import PuzzleEditorDialog from './PuzzleEditorDialog'

export default {
  name: 'PuzzleDataTable',

  components: {
    PuzzleEditorDialog
  },

  mixins: [paginable],

  data: () => ({
    filters: {
      curriculumTypeId: null,
      level: null
    },
    puzzles: [],
    loading: false,
    searchText: null,
    headers: [
      {
        text: 'Level',
        sortable: false,
        value: 'level'
      },
      {
        text: 'Image',
        value: 'image'
      },
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'Columns',
        value: 'columns'
      },
      {
        text: 'Rows',
        value: 'rows'
      },
      {
        text: 'Letter',
        value: 'curriculumType.letter'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 100
      }
    ],
    levels: [
      { label: 'All', value: null },
      { label: 'Beginner', value: 'BEGINNER' },
      { label: 'Intermediate', value: 'INTERMEDIATE' },
      { label: 'Advanced', value: 'ADVANCED' }
    ]
  }),

  computed: {
    ...mapGetters('admin/curriculum', ['types'])
  },

  watch: {
    'pagination.page' () {
      if (!this.loading) {
        this.refetchPuzzles()
      }
    }
  },

  created () {
    this.getTypes()
  },
  mounted () {
    this.refetchPuzzles()
  },
  methods: {
    ...mapActions('admin/curriculum', ['getTypes']),

    ...mapActions('puzzles', ['getPuzzles', 'deletePuzzle']),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchPuzzles()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchPuzzles()
    },
    async refetchPuzzles () {
      this.loading = true
      const name = this.searchText

      try {
        const { page, puzzle, total } = await this.getPuzzles({
          ...name && { name },
          curriculumTypeId: this.filters.curriculumTypeId || null,
          level: this.filters.level || null,
          page: this.pagination.page
        })

        this.puzzles = puzzle
        this.setPagination({ page, total })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete puzzle?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deletePuzzle(id)
          await this.refetchPuzzles()
        }
      })
    }
  }
}
</script>
