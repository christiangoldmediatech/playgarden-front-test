<template>
  <v-main>
    <!-- <div class="startLiveClass">
      <p class="text-center pt-3">
        <span class="text-h7 text-md-h5 font-weight-bold white--text pt-5">Live Classes will start January 11th, 2021</span>
      </p>
    </div> -->
    <v-row class="pos-relative pt-2" justify="center" align="center">
      <v-col cols="12">
        <week-selector
          v-if="today"
          :day="new Date(today)"
          @prev-week="removeWeek"
          @next-week="addWeek"
        />
      </v-col>
      <v-btn
        class="text-none mr-md-4"
        :class="{ 'pos-absolute pos-right-0': $vuetify.breakpoint.mdAndUp }"
        color="accent"
        @click.stop="goToRecordings"
      >
        Watch recorded classes
      </v-btn>
    </v-row>
    <v-container
      :class="{ 'lsess-container': !$vuetify.breakpoint.smAndDown }"
      fluid
    >
      <v-row class="fill-height">
        <v-col class="lsess-daily" cols="12" md="4" lg="3" xl="2">
          <today-cards-panel
            v-if="mode === 'TODAY'"
            @mode-change="mode = 'CALENDAR'"
          />
          <calendar-panel
            v-else
            v-model="today"
            @mode-change="mode = 'TODAY'"
          />
        </v-col>

        <v-col class="lsess-schedule" cols="12" md="8" lg="9" xl="10">
          <sessions-table :today="today" />
        </v-col>
      </v-row>
    </v-container>

    <entry-dialog />

    <recorded-class-player />

    <v-dialog
      :value="!hasTrialOrPlatinumPlan"
      content-class="elevation-0"
      :fullscreen="fullscreen"
      persistent
    >
      <v-card class="dialog-overlay">
        <v-row no-gutters justify="start" class="mt-0">
          <v-btn
            class="top-left text-none white--text px-4"
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
            class="mb-15 mt-16"
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
              <p class="text-center font-weight-bold mt-5">
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
                  :to="{ name: 'app-account', params: { changeplan: 1, planRedirect: 'app-live-classes' } }"
                >
                  <!-- nuxt to app-account ?changeplan=1 -->
                  COMPARE PLANS
                </v-btn>
              </v-row>
            </v-card>
          </v-row>
        </v-col>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { getMondayFriday } from '@/utils/dateTools'
import TodayCardsPanel from '@/components/app/live-sessions/TodayCardsPanel.vue'
import CalendarPanel from '@/components/app/live-sessions/CalendarPanel.vue'
import EntryDialog from '@/components/app/live-sessions/EntryDialog.vue'
import SessionsTable from '@/components/app/live-sessions/SessionsTable.vue'
import RecordedClassPlayer from '@/components/app/live-sessions/RecordedClassPlayer.vue'
import WeekSelector from '@/components/admin/live-sessions/WeekSelector.vue'

export default {
  name: 'Index',

  components: {
    TodayCardsPanel,
    CalendarPanel,
    EntryDialog,
    SessionsTable,
    RecordedClassPlayer,
    WeekSelector
  },

  data: () => {
    return {
      mode: 'TODAY',
      today: null,
      loading: false,
      fullscreen: true,
      showNotice: true
    }
  },

  computed: {
    ...mapState('live-sessions', ['sessions']),
    ...mapGetters('auth', {
      hasTrialOrPlatinumPlan: 'hasTrialOrPlatinumPlan'
    }),

    days () {
      if (this.today) {
        return getMondayFriday(this.getDateObj())
      }
      return null
    }
  },

  watch: {
    days () {
      this.getUserLiveSessions(this.days)
    }
  },

  created () {
    this.setToday(new Date())
    this.getUserLiveSessions(this.days)
  },

  methods: {
    ...mapActions('live-sessions', ['getUserLiveSessions']),
    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    goToRecordings () {
      this.$router.push({ name: 'app-live-classes-recorded' })
    },

    getDateObj () {
      const parts = this.today.split('-')
      return new Date(parts[0], parts[1] - 1, parts[2])
    },

    setToday (date) {
      this.today = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },

    addWeek () {
      const date = this.getDateObj()
      date.setDate(date.getDate() + 7)
      this.setToday(date)
    },

    removeWeek () {
      const date = this.getDateObj()
      date.setDate(date.getDate() - 7)
      this.setToday(date)
    }
  }
}
</script>

<style lang="scss">
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
    height: 90%; // TODO: Change back to 1005 when removing text Live Classes start
    max-height: 90%; // TODO: Change back to 1005 when removing text Live Classes start
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
}
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
}
.startLiveClass{
  background-color: var(--v-accent-base) !important;
  text-transform: uppercase !important;
  min-height: 50px !important;
  vertical-align: middle
}
.fullscreen {
  width: 100% !important;
  height: 100% !important;
}
</style>
