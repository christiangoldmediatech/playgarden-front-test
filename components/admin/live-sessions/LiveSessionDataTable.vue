<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Live Sessions Management

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
              :items="liveSessions"
              :loading="loading"
              :page.sync="pagination.page"
              :server-items-length="pagination.total"
              @update:page="pagination.page = $event"
              @refresh="refresh(true)"
            >
              <template v-slot:top>
                <live-session-editor-dialog
                  ref="editor"
                  @saved="refresh(false)"
                />
                <participants-live-session-dialog
                  ref="table"
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
                    solo-labeled
                    @keydown.enter="refresh(false)"
                  />
                </v-toolbar>
                <v-toolbar color="white" flat>
                  <v-spacer />
                </v-toolbar>
              </template>

              <template v-slot:[`item.dateStart`]="{ item }">
                {{ item.dateStart | formatDate }}
              </template>

              <template v-slot:[`item.dateEnd`]="{ item }">
                {{ item.dateEnd | formatDate }}
              </template>

              <template v-slot:[`item.createdAt`]="{ item }">
                {{ item.createdAt | formatDate }}
              </template>

              <template v-slot:[`item.updatedAt`]="{ item }">
                {{ item.updatedAt | formatDate }}
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <video-preview-btn v-if="item.videos" :video="item.videos" />

                <grades-btn :data-item="item" :entity-type="entityType" />

                <v-icon
                  color="#5B5B59"
                  dense
                  @click="$refs.table.open(null, item)"
                >
                  mdi-account-check
                </v-icon>

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
import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'

import paginable from '@/utils/mixins/paginable'
import GradesBtn from '@/components/admin/grades/GradesBtn.vue'
import LiveSessionEditorDialog from './LiveSessionEditorDialog'
import ParticipantsLiveSessionDialog from './ParticipantsLiveSessionDialog'

export default {
  name: 'LiveSessionDataTable',

  components: {
    LiveSessionEditorDialog,
    ParticipantsLiveSessionDialog,
    VideoPreviewBtn,
    GradesBtn
  },

  mixins: [paginable],

  data: () => ({
    filters: {
      activityTypeId: null
    },
    checkStatusInterval: null,
    liveSessions: [],
    entityType: 'LiveSessions',
    loading: false,
    search: null,
    page: 1,
    headers: [
      {
        text: 'Date Start',
        value: 'dateStart'
      },
      {
        text: 'Date End',
        value: 'dateEnd'
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
        width: 180
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
    this.getTypes({ extra: true })
    this.getCurriculumTypes()
  },

  beforeDestroy () {
    clearInterval(this.checkStatusInterval)
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes']),
    ...mapActions('admin/curriculum', {
      getCurriculumTypes: 'getTypes'
    }),

    ...mapActions('live-sessions', ['getLiveSessions', 'deleteLiveSession']),

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = null
      }

      try {
        const { page, liveSessions, total } = await this.getLiveSessions({
          name: this.search,
          activityTypeId: this.filters.activityTypeId || null,
          level: this.filters.level || null,
          page: this.pagination.page,
          limit: this.pagination.limit
        })
        this.checkStatus()
        this.stopInterval()

        this.liveSessions = liveSessions
        this.setPagination({ page, total })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete Live Session?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteLiveSession(id)
          await this.refresh()
        }
      })
    },

    checkStatus () {
      if (this.liveSessions.filter(data => data.videos && data.videos.status !== 'COMPLETED').length > 0) {
        this.checkStatusInterval = setInterval(() => {
          this.refresh()
        }, 120000)
      }
    },

    stopInterval () {
      if (this.liveSessions.filter(data => data.videos && data.videos.status !== 'COMPLETED').length === 0) {
        clearInterval(this.checkStatusInterval)
      }
    }
  }
}
</script>
