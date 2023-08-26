<template>
  <v-main class="pg-mt-8" data-test-id="live-classes-content">
    <pg-loading :loading="loading" fullscreen>
      <v-container
        v-if="$vuetify.breakpoint.lgAndUp"
        class="lsess-container"
        fluid
      >
        <unlock-prompt
          v-if="hasBasicPlayAndLearnPlan && !loading"
          title="LIVE CLASSES"
          desc="Unlock the live classes section"
          img="live-classes.svg"
          :padding="110"
          vertical
          :top="-70"
        />

        <v-row class="fill-height">
          <v-col>
            <v-navigation-drawer
              :mini-variant="drawer"
              absolute
              bottom
              mini-variant-width="80"
              width="400"
              class="!pg-z-50"
            >
              <v-row>
                <v-col
                  cols="12"
                  class="d-flex"
                  :class="[
                    !drawer ? 'pg-justify-end pg-pr-12' : 'pg-justify-center'
                  ]"
                >
                  <v-btn icon @click="drawer = !drawer">
                    <img
                      v-if="drawer"
                      src="@/assets/svg/meetings/open-menu.svg"
                      alt="Open Menu"
                    />
                    <img
                      v-else
                      src="@/assets/svg/meetings/close-menu.svg"
                      alt="Open Menu"
                    />
                  </v-btn>
                </v-col>
                <v-col v-if="!drawer" class="lsess-daily" cols="12">
                  <today-cards-panel
                    :type="filterType"
                    @change="filterMeetings($event)"
                  />
                </v-col>
              </v-row>
            </v-navigation-drawer>
          </v-col>

          <v-col class="pt-0 lsess-schedule" cols="11">
            <v-row
              class="my-0 pos-relative pt-md-2 pg-max-w-5xl pg-mx-auto"
              justify="center"
              align="center"
            >
              <v-btn-toggle
                v-model="viewModeVal"
                class="mt-6 text-none ml-md-4 mt-md-0"
                :class="{
                  'pos-absolute pos-left-0': $vuetify.breakpoint.mdAndUp
                }"
              >
                <v-btn
                  :color="viewMode === 'WEEK' ? 'accent' : 'white'"
                  class="lsess-switcher-btn text-none font-weight-light"
                  :class="{
                    'white--text': viewMode === 'WEEK'
                  }"
                >
                  Week
                </v-btn>
                <v-btn
                  :color="viewMode === 'DAY' ? 'accent' : 'white'"
                  class="lsess-switcher-btn text-none font-weight-light"
                  :class="{
                    'white--text': viewMode === 'DAY'
                  }"
                >
                  Day
                </v-btn>
              </v-btn-toggle>

              <v-col class="hidden-sm-and-down" cols="12">
                <template v-if="viewMode === 'WEEK'">
                  <week-selector
                    v-if="today"
                    :day="getDateObj()"
                    @prev-week="removeWeek"
                    @next-week="addWeek"
                  />
                </template>
                <template v-if="viewMode === 'DAY'">
                  <day-selector
                    v-if="today"
                    :day="getDateObj()"
                    @prev-day="removeDay"
                    @next-day="addDay"
                  />
                </template>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <span id="time-zone-changer" class="font-weight-bold">
                  *Hours are in {{ getAcronymCurrent }}, you can change your
                  time zone by clicking
                  <span
                    class=" text-decoration-underline font-weight-bold timezone"
                    @click="timezoneDialog = true"
                  >
                    HERE
                  </span>
                </span>
              </v-col>
            </v-row>

            <sessions-table
              v-if="!loading"
              :day-mode="viewMode === 'DAY'"
              :today="today"
              :holidays="getHolidays"
            />
          </v-col>
        </v-row>
        <live-classes-tutorial />
      </v-container>

      <v-container
        v-else
        class="lclass-mobile"
        :class="{ 'lclass-mobile-lock': hasBasicPlayAndLearnPlan }"
      >
        <unlock-prompt
          v-if="hasBasicPlayAndLearnPlan && !loading"
          title="LIVE CLASSES"
          desc="Unlock the live classes section"
          img="live-classes.svg"
          vertical
          :top="-100"
          :padding="120"
        />
        <div class="header">
          <img class="camera-icon" src="@/assets/svg/sessions-camera.svg" />
          Live Classes Schedule
        </div>

        <week-selector
          v-if="today"
          :day="getDateObj()"
          @prev-week="removeWeek"
          @next-week="addWeek"
        />

        <v-row class="mt-4 px-4" justify="space-around">
          <div
            v-for="(session, index) in sessionsWithHolidays"
            :key="index"
            class="today-cards-wrapper"
            :style="{ width: `calc(300px * ${session.sessions.length})` }"
          >
            <holiday-card
              v-if="session.holiday"
              :holiday="session.holiday"
              holiday-type="day"
              height="100%"
              top-position="0"
            />
            <today-card
              v-for="entry in session.sessions"
              :key="`lclass-entry-${entry.id}`"
              v-bind="{ entry }"
              mobile
            />
          </div>
          <v-col v-if="orderedSessions.length === 0" cols="12">
            <v-card>
              <v-card-text class="text-center text-h6">
                There are no live classes programmed for this week. Check back
                later.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <live-classes-tutorial />
      </v-container>
    </pg-loading>

    <entry-dialog @refresh="getUserLiveSessions" />

    <recorded-class-player />

    <pg-dialog
      :value="!hasTrialOrPlatinumPlan"
      content-class="elevation-0"
      :fullscreen="fullscreen"
      persistent
    >
      <v-card class="dialog-overlay">
        <v-row no-gutters justify="start" class="mt-0">
          <v-btn
            class="px-4 top-left text-none white--text"
            color="white"
            text
            :to="'./dashboard'"
            @click.stop="overlay = false"
          >
            <v-icon class="mr-2" small left>
              mdi-less-than
            </v-icon>
            Back
          </v-btn>
        </v-row>
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
              <p class="mt-5 text-center font-weight-bold">
                Get access to Live Classes
              </p>
              <p class="text-center">
                Upgrade your plan
              </p>
              <v-row justify="center" no-gutters>
                <v-btn
                  color="accent"
                  width="250"
                  tile
                  x-large
                  nuxt
                  :to="{
                    name: 'app-account-index',
                    params: { changeplan: 1, planRedirect: 'app-live-classes' }
                  }"
                >
                  <!-- nuxt to app-account-index ?changeplan=1 -->
                  COMPARE PLANS
                </v-btn>
              </v-row>
            </v-card>
          </v-row>
        </v-col>
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
                    <v-btn
                      class="mt-3 mr-4"
                      color="accent"
                      @click="saveTimeZone"
                    >
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
  </v-main>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import {
  getWeekStartAndEnd,
  timezoneOptions,
  getTimezone
} from '@/utils/dateTools'
import TodayCardsPanel from '@/components/app/live-sessions/TodayCardsPanel.vue'
import TodayCard from '@/components/app/live-sessions/TodayCard.vue'
import EntryDialog from '@/components/app/live-sessions/EntryDialog.vue'
import SessionsTable from '@/components/app/live-sessions/SessionsTable.vue'
import RecordedClassPlayer from '@/components/app/live-sessions/RecordedClassPlayer.vue'
import WeekSelector from '@/components/app/live-sessions/WeekSelector.vue'
import DaySelector from '@/components/app/live-sessions/DaySelector.vue'
import UnlockPrompt from '@/components/app/all-done/UnlockPrompt.vue'
import { jsonCopy } from '@/utils'
import dayjs from 'dayjs'
import HolidayCard from '@/components/app/live-sessions/HolidayCard.vue'
import LiveClassesTutorial from '@/components/tutorial/pages/LiveClassesTutorial.vue'

export default {
  name: 'Index',

  components: {
    TodayCardsPanel,
    TodayCard,
    EntryDialog,
    SessionsTable,
    RecordedClassPlayer,
    WeekSelector,
    DaySelector,
    UnlockPrompt,
    HolidayCard,
    LiveClassesTutorial
  },

  data: () => {
    return {
      mode: 'TODAY',
      today: null,
      currentTimeZone: null,
      loading: false,
      fullscreen: true,
      showNotice: true,
      selectedTimezone: 'America/New_York',
      timezoneDialog: false,
      timezoneOptions,
      viewModeVal: 0,
      drawer: true,
      filterType: 'all'
    }
  },

  computed: {
    ...mapState('live-sessions', ['sessions']),
    ...mapGetters('live-sessions', ['getHolidays']),
    ...mapGetters('auth', ['getUserInfo', 'hasBasicPlayAndLearnPlan', 'isRegistrationComplete']),
    ...mapGetters('auth', {
      hasTrialOrPlatinumPlan: 'hasTrialOrPlatinumPlan'
    }),

    days() {
      if (this.today) {
        return getWeekStartAndEnd(this.getDateObj())
      }
      return null
    },

    getAcronymCurrent() {
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
    },

    orderedSessions() {
      const sessions = jsonCopy(this.sessions)
      const now = dayjs().unix()

      return sessions
        .filter((session) => {
          return (
            dayjs(session.dateEnd)
              .add(30, 'minutes')
              .unix() >= now
          )
        })
        .sort((sessionA, sessionB) => {
          const start = new Date(sessionA.dateStart)
          const end = new Date(sessionB.dateEnd)

          return start.getTime() - end.getTime()
        })
    },

    viewMode() {
      let mode = 'WEEK'
      switch (this.viewModeVal) {
        case 0:
          mode = 'WEEK'
          break
        case 1:
          mode = 'DAY'
          break
        case 2:
          mode = 'TIME'
          break
      }
      return mode
    },

    sessionsWithHolidays() {
      const groups = this.getHolidays.map((holiday) => ({
        holiday: {
          ...holiday,
          dateStart: dayjs(holiday.dateStart),
          dateEnd: dayjs(holiday.dateEnd)
        },
        dateStart: holiday.dateStart,
        dateEnd: holiday.dateEnd,
        sessions: []
      }))
      for (const session of this.orderedSessions) {
        const matchingHoliday = groups.find((group) => {
          if (!group.holiday) {
            return false
          }

          const sessionDate = dayjs(session.dateStart)
          return (
            group.holiday.dateStart.get('date') <= sessionDate.get('date') &&
            sessionDate.get('date') <= group.holiday.dateEnd.get('date')
          )
        })

        if (matchingHoliday) {
          matchingHoliday.sessions.push(session)
        } else {
          groups.push({
            holiday: null,
            dateStart: session.dateStart,
            dateEnd: session.dateEnd,
            sessions: [{ ...session }]
          })
        }
      }

      return groups
        .filter((group) => group.sessions.length > 0)
        .sort((sessionA, sessionB) => {
          const start = new Date(sessionA.dateStart)
          const end = new Date(sessionB.dateEnd)

          return start.getTime() - end.getTime()
        })
    }
  },

  watch: {
    days() {
      this.getUserLiveSessions(this.days)
      this.getFilteredHolidays()
    },

    sessions() {
      const sessionId = Number(this.$route.query.sid) || 0
      this.$router.push({ name: 'app-live-classes' })
      if (!sessionId) {
        return
      }

      const foundSession = this.sessions.find((s) => s.id === sessionId)
      if (!foundSession) {
        return
      }

      this.$nuxt.$emit('open-entry-dialog', foundSession)
    }
  },

  created() {
    if (!this.isRegistrationComplete) {
      this.$router.push({
        name: 'app-index'
      })
    } else {
      this.setToday(new Date())
      this.getUserLiveSessions(this.days)
      this.getFilteredHolidays()
      this.setCurrentTimezone()
    }

    // tutorial
    this.$appEventBus.$on('tutorial-open-drawer', () => {
      this.drawer = false
    })

    this.$appEventBus.$on('tutorial-close-drawer', () => {
      this.drawer = true
    })
  },

  methods: {
    async getUserLiveSessions() {
      this.loading = true
      await this.$store.dispatch('live-sessions/getUserLiveSessions', {
        ...this.days,
        type: this.filterType
      })
      this.loading = false
    },

    ...mapActions('admin/users', ['setTimezone']),
    ...mapActions('auth', ['fetchUserInfo']),
    ...mapActions('live-sessions', ['fetchHolidays']),

    async getFilteredHolidays() {
      this.loading = true
      await this.fetchHolidays({ ...this.days })
      this.loading = false
    },

    close() {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
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

    getDateObj() {
      const parts = this.today.split('-')
      return new Date(parts[0], parts[1] - 1, parts[2])
    },

    setToday(date) {
      this.today = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}`
    },

    addWeek() {
      const date = this.getDateObj()
      date.setDate(date.getDate() + 7)
      this.setToday(date)
    },

    removeWeek() {
      const date = this.getDateObj()
      date.setDate(date.getDate() - 7)
      this.setToday(date)
    },

    addDay() {
      const date = this.getDateObj()
      date.setDate(date.getDate() + 1)
      this.setToday(date)
    },

    removeDay() {
      const date = this.getDateObj()
      date.setDate(date.getDate() - 1)
      this.setToday(date)
    },

    async saveTimeZone() {
      this.loading = true
      try {
        await this.setTimezone({ timezone: this.selectedTimezone })
        await this.fetchUserInfo()
        await this.getUserLiveSessions(this.days)
        this.viewModeVal = 0
        this.timezoneDialog = false
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    filterMeetings(type) {
      this.filterType = type
      this.getUserLiveSessions()
    }
  }
}
</script>

<style lang="scss">
.lclass-mobile-lock {
  min-height: 500px;
}

.lclass-mobile {
  margin-top: 12px;

  & div.header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.5;
    color: #606060;
    margin-bottom: 12px;

    & img.camera-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }
}

.lsess {
  &-container {
    height: calc(100vh - 64px);
    max-height: calc(100vh - 64px);
    overflow: hidden;
  }
  &-coming-soon {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  &-daily {
    height: 100%; // TODO: Change back to 1005 when removing text Live Classes start
    max-height: 100%; // TODO: Change back to 1005 when removing text Live Classes start
  }
  &-schedule {
    max-height: 100%;
  }
  &-title {
    font-size: 1.15rem;
    font-weight: bold;
    line-height: 1.87;
  }
  &-calendar {
    &-btn {
      min-height: 64px;
    }
  }
  &-switcher-btn {
    width: 80px;
  }
}
.timezone {
  color: var(--v-accent-base) !important;
  font-weight: 500 !important;
  cursor: pointer !important;
}
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
}
.startLiveClass {
  background-color: var(--v-accent-base) !important;
  text-transform: uppercase !important;
  min-height: 50px !important;
  vertical-align: middle;
}
.fullscreen {
  width: 100% !important;
  height: 100% !important;
}
.today-cards-wrapper {
  position: relative;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 100%;
}
</style>
