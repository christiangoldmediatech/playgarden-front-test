<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Live Class Management

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
                Add new live class
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete live classes.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card width="100%">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <live-session-editor-dialog
              ref="editor"
              mode="LiveClass"
              @saved="refresh(false)"
            />
            <participants-live-session-dialog
              ref="table"
            />

            <v-toolbar color="white" flat>
              <v-btn-toggle v-model="viewModeVal" class="pos-absolute pos-left-0">
                <v-btn
                  :color="viewMode === 'CALENDAR' ? 'accent' : 'white'"
                  class="text-none font-weight-light"
                  :class="{
                    'white--text': viewMode === 'CALENDAR'
                  }"
                >
                  <v-icon left :color="viewMode === 'CALENDAR' ? 'white' : 'accent'">
                    mdi-apps
                  </v-icon>
                  Calendar
                </v-btn>
                <v-btn
                  :color="viewMode === 'LIST' ? 'accent' : 'white'"
                  class="text-none font-weight-light"
                  :class="{
                    'white--text': viewMode === 'LIST'
                  }"
                >
                  <v-icon left :color="viewMode === 'LIST' ? 'white' : 'accent'">
                    mdi-view-list
                  </v-icon>
                  List
                </v-btn>
              </v-btn-toggle>

              <v-spacer />

              <template v-if="viewMode === 'CALENDAR'">
                <week-selector :day="day" :loading="loading" @prev-week="removeWeek" @next-week="addWeek" />
                <v-spacer />
              </template>

              <v-switch
                v-if="viewMode === 'LIST'"
                v-model="filterDeleted"
                class="mx-1 my-1 pa-0 mr-4"
                color="primary darken-2"
                hide-details
                label="Deleted"
                @change="refresh(false)"
              />

              <pg-text-field
                v-if="viewMode === 'LIST'"
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
          </v-col>
          <v-col cols="12">
            <span class="font-weight-bold">
              *Hours are in {{ getAcronymCurrent }}, you can change your time zone by clicking <span class=" text-decoration-underline font-weight-bold timezone" @click="timezoneDialog = true"> HERE</span>
            </span>
          </v-col>
          <template v-if="viewMode === 'CALENDAR'">
            <calendar-view :day="day" @loading="onLoading" />
          </template>
          <template v-else-if="viewMode === 'LIST'">
            <v-col cols="12">
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
                <!-- <template v-slot:top>
                  <v-toolbar color="white" flat>
                    <v-spacer />
                  </v-toolbar>
                </template> -->

                <template v-slot:[`item.active`]="{ item }">
                  {{ (item.active) ? 'ACTIVE' : 'INACTIVE' }}
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
                    v-if="item.deletedAt"
                    color="#E8B927"
                    dense
                    @click="recover(item)"
                  >
                    mdi-backup-restore
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
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </v-card>
    <pg-dialog
      :value="timezoneDialog"
      content-class="elevation-0"
      :fullscreen="fullscreen"
      persistent
    >
      <v-card class="dialog-overlay">
        <v-row no-gutters justify="start" class="mt-0">
          <v-col class="mt-16">
            <v-row
              class="mt-16 mb-15"
              justify="center"
              align-content="center"
              no-gutters
            >
              <v-card
                cols="12"
                sm="4"
                class="px-3 mt-16"
                width="400"
                height="200"
                tile
              >
                <v-card-text>
                  <v-row justify="center" no-gutters>
                    TIMEZONE
                  </v-row>
                  <v-row>
                    <pg-select
                      v-model="selectedTimezone"
                      clearable
                      hide-details
                      item-text="name"
                      item-value="value"
                      label="Timezone"
                      solo-labeled
                      :items="timezoneOptions"
                      class="select"
                    />
                  </v-row>
                  <v-row justify="center">
                    <v-btn class="mt-3 mr-4" color="accent" @click="saveTimeZone">
                      Save
                    </v-btn>
                    <v-btn class="mt-3" color="" @click="closeTimezoneModal">
                      Close
                    </v-btn>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </pg-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'
import { timezoneOptions, getTimezone } from '@/utils/dateTools'

import paginable from '@/utils/mixins/paginable'
import GradesBtn from '@/components/admin/grades/GradesBtn.vue'
import LiveSessionEditorDialog from './LiveSessionEditorDialog'
import ParticipantsLiveSessionDialog from './ParticipantsLiveSessionDialog'
import CalendarView from './CalendarView.vue'
import WeekSelector from './WeekSelector.vue'

export default {
  name: 'LiveSessionDataTable',

  components: {
    LiveSessionEditorDialog,
    ParticipantsLiveSessionDialog,
    VideoPreviewBtn,
    GradesBtn,
    CalendarView,
    WeekSelector
  },

  mixins: [paginable],

  data: () => ({
    filters: {
      activityTypeId: null
    },
    filterDeleted: false,
    checkStatusInterval: null,
    selectedTimezone: 'America/New_York',
    liveSessions: [],
    fullscreen: true,
    timezoneDialog: false,
    timezoneOptions,
    viewModeVal: 0,
    entityType: 'Meetings',
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
        text: 'Status',
        value: 'active'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 205
      }
    ],
    day: new Date()
  }),

  computed: {
    ...mapGetters('admin/curriculum', ['types']),
    ...mapGetters('auth', ['getUserInfo']),
    viewMode () {
      if (this.viewModeVal === 0) {
        return 'CALENDAR'
      }
      return 'LIST'
    },

    getAcronymCurrent () {
      let acronym = ''
      switch (this.selectedTimezone) {
        case 'America/New_York':
          acronym = 'EST'
          break
        case 'Pacific/Honolulu':
          acronym = 'HST'
          break
        case 'America/Anchorage':
          acronym = 'AKST'
          break
        case 'America/Los_Angeles':
          acronym = 'PST'
          break
        case 'America/Denver':
          acronym = 'MST'
          break
        case 'America/Chicago':
          acronym = 'CST'
          break
      }
      return acronym
    }
  },

  watch: {
    'pagination.page' () {
      if (!this.loading) {
        this.refresh()
      }
    },

    viewMode () {
      this.refresh(false)
    },

    liveSessions () {
      this.checkStatus()
    }
  },

  created () {
    this.getTypes({ extra: true })
    this.getCurriculumTypes()
    this.setCurrentTimezone()
  },

  mounted () {
    this.$nuxt.$on('open-entry-editor-dialog', (entry) => {
      if (this.$refs && this.$refs.editor) {
        this.$refs.editor.open(null, entry)
      }
    })
  },

  beforeDestroy () {
    clearInterval(this.checkStatusInterval)
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes']),
    ...mapActions('admin/curriculum', {
      getCurriculumTypes: 'getTypes'
    }),
    ...mapActions('admin/users', ['setTimezone']),
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('live-sessions', ['getLiveSessions', 'deleteLiveSession', 'recoverLiveSession']),

    closeTimezoneModal() {
      this.timezoneDialog = false
      this.viewModeVal = 0
      this.setCurrentTimezone()
    },

    setCurrentTimezone() {
      const { timezone } = this.getUserInfo
      const currentTimezone = getTimezone(timezone)
      this.selectedTimezone = currentTimezone
    },

    async refresh (clear = false) {
      if (this.viewMode === 'CALENDAR') {
        this.$nuxt.$emit('calendar-update')
      } else {
        this.loading = true

        if (clear) {
          this.search = null
        }

        try {
          const { page, meetings, total } = await this.getLiveSessions({
            name: this.search,
            activityTypeId: this.filters.activityTypeId || null,
            level: this.filters.level || null,
            page: this.pagination.page,
            type: 'LiveClass',
            limit: this.pagination.limit,
            deleted: (this.filterDeleted) ? 'true' : null
          })
          this.liveSessions = meetings
          this.setPagination({ page, total })
        } catch (e) {
        } finally {
          this.loading = false
        }
      }
    },

    remove ({ id, title }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete Live Class?',
        message: `Are you sure you want to delete <b>${title}</b>?`,
        action: async () => {
          await this.deleteLiveSession(id)
          await this.refresh()
        }
      })
    },

    recover ({ id, title }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Recover Live Class?',
        message: `Are you sure you want to recover <b>${title}</b>?`,
        actionText: 'Recover it!',
        action: async () => {
          await this.recoverLiveSession(id)
          await this.refresh()
        }
      })
    },

    checkStatus () {
      if (this.liveSessions.filter(data => data.videos && data.videos.status !== 'COMPLETED').length > 0) {
        if (this.checkStatusInterval === null) {
          this.checkStatusInterval = setInterval(() => {
            this.refresh()
          }, 120000)
        }
      } else {
        clearInterval(this.checkStatusInterval)
      }
    },

    onLoading (val) {
      this.loading = val
    },

    addWeek () {
      this.day.setDate(this.day.getDate() + 7)
      this.day = new Date(this.day)
    },

    removeWeek () {
      this.day.setDate(this.day.getDate() - 7)
      this.day = new Date(this.day)
    },

    async saveTimeZone () {
      this.loading = true
      try {
        await this.setTimezone({ timezone: this.selectedTimezone })
        await this.fetchUserInfo()
        this.refresh()
        this.viewModeVal = 0
        this.timezoneDialog = false
      } catch (err) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
}
.timezone {
  color: var(--v-accent-base) !important;
  font-weight: 500 !important;
  cursor: pointer !important;
}
</style>
