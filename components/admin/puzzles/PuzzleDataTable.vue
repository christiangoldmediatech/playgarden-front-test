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
              hide-default-footer
              :items="puzzles"
              :loading="loading"
              :page.sync="pagination.page"
              :server-items-length="pagination.total"
              @update:page="pagination.page = $event"
            >
              <template v-slot:top>
                <puzzle-editor-dialog ref="editor" @saved="refresh(false)" />

                <v-toolbar color="white" flat>
                  <v-spacer />

                  <pg-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    class="shrink"
                    clearable
                    hide-details
                    label="Search"
                    single-line
                    solo
                    @keydown.enter="refresh(false)"
                  />
                </v-toolbar>
                <v-toolbar color="white" flat>
                  <v-spacer />
                </v-toolbar>
              </template>

              <template v-slot:item.image="{ item }">
                <img v-if="item.image" :src="item.image" width="32px">

                <span v-else>
                  N/A
                </span>
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
                  @click="$refs.editor.open(null, item)"
                >
                  mdi-pencil-outline
                </v-icon>

                <v-icon color="#d30909" dense @click="remove(item)">
                  mdi-delete-outline
                </v-icon>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary" text @click="refresh(true)">
                  Refresh
                </v-btn>
              </template>

              <template v-slot:loading>
                <v-skeleton-loader class="mx-auto" type="table-row-divider@3" />
              </template>
            </pg-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
    search: null,
    page: 1,
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
        this.refresh()
      }
    }
  },

  created () {
    this.getTypes()
  },

  methods: {
    ...mapActions('admin/curriculum', ['getTypes']),

    ...mapActions('puzzles', ['getPuzzles', 'deletePuzzle']),

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = null
      }

      try {
        const { page, puzzle, total } = await this.getPuzzles({
          name: this.search,
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
        message: `Are you sure you wish to delete '${name}' puzzle?`,
        action: async () => {
          await this.deletePuzzle(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
