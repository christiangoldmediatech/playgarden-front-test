<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Recurring Live Sessions Management

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
                Add new live session
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete live sessions.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <v-data-table
              :headers="headers"
              hide-default-footer
              :items="recurringLiveSessions"
              :loading="loading"
              :page.sync="pagination.page"
              :server-items-length="pagination.total"
              @update:page="pagination.page = $event"
              @refresh="refresh(true)"
            >
              <template v-slot:top>
                <recurring-live-session-editor-dialog
                  ref="editor"
                  @saved="refresh(false)"
                />

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

              <template v-slot:item.dateStart="{ item }">
                {{ item.dateStart | formatDate }}
              </template>

              <template v-slot:item.dateEnd="{ item }">
                {{ item.dateEnd | formatDate }}
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

              <template v-slot:footer="{ props }">
                <v-container fluid>
                  <v-row align="center" justify="end">
                    <v-icon
                      class="clickable mr-2"
                      color="green"
                      :disabled="props.pagination.page === 1 || loading"
                      x-small
                      @click.stop="pagination.page--"
                      v-text="'mdi-less-than'"
                    />

                    <template v-for="i in props.pagination.pageCount">
                      <span
                        :key="`footer-page-number-${i}`"
                        :class="[
                          'font-weight-normal',
                          {
                            'accent--text text--darken-1':
                              props.pagination.page === i,
                            clickable: props.pagination.page !== i,
                          },
                        ]"
                        @click.stop="pagination.page = i"
                      >
                        {{ i }}
                      </span>
                      <span
                        v-if="i !== props.pagination.pageCount"
                        :key="`footer-page-dot-${i}`"
                        class="font-weight-normal mx-1"
                      >
                        &centerdot;
                      </span>
                    </template>

                    <v-icon
                      class="clickable ml-2"
                      color="green"
                      :disabled="
                        props.pagination.page === props.pagination.pageCount ||
                          loading
                      "
                      x-small
                      @click.stop="pagination.page++"
                      v-text="'mdi-greater-than'"
                    />
                  </v-row>
                </v-container>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import paginable from '@/utils/mixins/paginable'
import RecurringLiveSessionEditorDialog from './RecurringLiveSessionEditorDialog'

export default {
  name: 'RecurringLiveSessionDataTable',

  components: {
    RecurringLiveSessionEditorDialog
  },

  mixins: [paginable],

  data: () => ({
    filters: {
      activityTypeId: null
    },
    recurringLiveSessions: [],
    loading: false,
    search: null,
    page: 1,
    headers: [
      {
        text: 'Date Start',
        value: 'dateStart'
      },
      {
        text: 'Title',
        value: 'title'
      },
      {
        text: 'Link',
        value: 'link'
      },
      {
        text: 'Teacher',
        value: 'teacher'
      },
      {
        text: 'Ages',
        value: 'ages'
      },
      {
        text: 'Duration',
        value: 'duration'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 100
      }
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
    ...mapActions('admin/activity', ['getTypes']),

    ...mapActions('admin/recurring-live-sessions', ['getRecurringLiveSessions', 'deleteRecurringLiveSession']),

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = null
      }

      try {
        const { page, recurringLiveSessions, total } = await this.getRecurringLiveSessions({
          name: this.search,
          activityTypeId: this.filters.activityTypeId || null,
          level: this.filters.level || null,
          page: this.pagination.page,
          limit: this.pagination.limit
        })

        this.recurringLiveSessions = recurringLiveSessions
        this.setPagination({ page, total })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete Live Session?',
        message: `Are you sure you wish to delete '${name}' Live Session?`,
        action: async () => {
          await this.deleteRecurringLiveSession(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
