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
                Add new  Recurring live session
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete Recurring live sessions.
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
              :items-per-page="paginationLimit"
              :loading="loading"
              :page.sync="pagination.page"
              :server-items-length="pagination.total"
              @update:page="pagination.page = $event"
              @refresh="refresh(true)"
            >
              <template v-slot:top>
                <recurring-live-session-editor-dialog
                  ref="editor"
                  @saved="refreshView"
                />

                <v-toolbar color="white" flat>
                  <span class="font-weight-bold">
                    *Hours are in {{ getAcronymCurrent }}, you can change your time zone by clicking <span class=" text-decoration-underline font-weight-bold timezone" @click="timezoneDialog = true"> HERE</span>
                  </span>
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

              <template #[`item.dateStart`]="{ item }">
                {{ getTimeZoneFormat(item.dateStart) }}
              </template>

              <template #[`item.dateEnd`]="{ item }">
                {{ getTimeZoneFormat(item.dateEnd) }}
              </template>

              <template #[`item.createdAt`]="{ item }">
                {{ item.createdAt | formatDate }}
              </template>

              <template #[`item.updatedAt`]="{ item }">
                {{ item.updatedAt | formatDate }}
              </template>

              <template #[`item.actions`]="{ item }">
                <v-icon
                  class="clickable"
                  color="primary"
                  dense
                  :disabled="!item.active"
                  @click="createLiveClasses(item.id); currentMeeting = item"
                >
                  mdi-plus-circle
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

    <!-- Loading dialog for when live classes are being created -->
    <pg-dialog v-model="creatingLiveClassesDialog" :persistent="creatingLiveClasses" max-width="480">
      <v-card>
        <v-card-title :class="{ 'justify-center': creatingLiveClasses }">
          <template v-if="creatingLiveClasses">
            Creating Recurring {{ getTitleMeeting }}
          </template>
          <template v-else-if="showLiveClassesCreated">
            Recurring {{ getTitleMeeting }} Created!
            <v-spacer />
            <v-btn icon @click="creatingLiveClassesDialog = false">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </template>
        </v-card-title>

        <v-card-text class="text-center">
          <v-progress-linear v-if="creatingLiveClasses" indeterminate color="primary" />
          <template v-else>
            <p>
              Your recurring {{ getTitleMeeting }} have been successfully created! Click anywhere outside this window to close it or the button below to see your changes.
            </p>
            <v-btn v-if="currentMeeting.type === 'LiveClass'" color="primary" @click="goToLiveClassesManagement">
              View on Live Classes Management
            </v-btn>
            <br>
            <v-btn class="mt-3" color="accent" @click="creatingLiveClassesDialog = false">
              Close
            </v-btn>
          </template>
        </v-card-text>
      </v-card>
    </pg-dialog>
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
import { mapActions, mapGetters, mapState } from 'vuex'
import { timezoneOptions, getTimezone, formatTimezone } from '@/utils/dateTools'
import moment from 'moment'
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
    currentMeeting: {
      type: ''
    },
    selectedTimezone: 'America/New_York',
    fullscreen: true,
    timezoneOptions,
    timezoneDialog: false,
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
        text: 'Day',
        value: 'day'
      },
      {
        text: 'Title',
        value: 'title'
      },
      {
        text: 'Type',
        value: 'type'
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
    ...mapGetters('admin/curriculum', ['types']),
    ...mapState('admin', ['paginationLimit']),
    ...mapState('admin/recurring-live-sessions', ['creatingLiveClasses', 'showLiveClassesCreated']),
    ...mapGetters('auth', ['getUserInfo']),

    getTitleMeeting () {
      return (this.currentMeeting.type === 'LiveClass') ? 'Live Class' : 'Playdate'
    },

    creatingLiveClassesDialog: {
      get () {
        return this.creatingLiveClasses || this.showLiveClassesCreated
      },

      set (value) {
        this.$store.commit('admin/recurring-live-sessions/SET_SHOW_LIVE_CLASSES_CREATED', value)
      }
    },
    getAcronymCurrent () {
      const { timezone } = this.getUserInfo
      let acronym = ''
      switch (timezone) {
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
    }
  },

  created () {
    this.getTypes({ extra: true })
    this.setCurrentTimezone()
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes']),
    ...mapActions('admin/users', ['setTimezone']),
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('admin/recurring-live-sessions', ['getRecurringLiveSessions', 'deleteRecurringLiveSession', 'createLiveClasses']),

    goToLiveClassesManagement () {
      this.$store.commit('admin/recurring-live-sessions/SET_SHOW_LIVE_CLASSES_CREATED', false)
      this.$router.push({ name: 'admin-live-session-management' })
    },

    refreshView () {
      this.setCurrentTimezone()
      this.refresh(false)
    },

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = null
      }

      try {
        const { page, recurringMeetings, total } = await this.getRecurringLiveSessions({
          name: this.search,
          activityTypeId: this.filters.activityTypeId || null,
          level: this.filters.level || null,
          page: this.pagination.page,
          limit: this.paginationLimit
        })

        this.recurringLiveSessions = recurringMeetings
        this.setPagination({ page, total })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, title }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete Recurring Live Session?',
        message: `Are you sure you want to delete <b>${title}</b>?`,
        action: async () => {
          await this.deleteRecurringLiveSession(id)
          await this.refresh()
        }
      })
    },

    getTimeZoneFormat (data) {
      const start = moment(data)
      const { timezone } = this.getUserInfo
      return formatTimezone(start, {
        format: 'MM-DD-YYYY HH:mm',
        timezone,
        returnObject: false
      })
    },
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
