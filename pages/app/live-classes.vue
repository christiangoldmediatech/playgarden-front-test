<template>
  <v-main>
    <v-container
      :class="{ 'lsess-container': !$vuetify.breakpoint.smAndDown }"
      fluid
    >
      <v-row class="fill-height">
        <v-col class="lsess-daily" cols="12" md="4" lg="3" xl="2">
          <today-cards-panel v-if="mode === 'TODAY'" @mode-change="mode = 'CALENDAR'" />
          <calendar-panel v-else v-model="today" @mode-change="mode = 'TODAY'" />
        </v-col>

        <v-col class="lsess-schedule" cols="12" md="8" lg="9" xl="10">
          <sessions-table :today="today" />
        </v-col>
      </v-row>
    </v-container>
    <entry-dialog />
  </v-main>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TodayCardsPanel from '@/components/app/live-sessions/TodayCardsPanel.vue'
import CalendarPanel from '@/components/app/live-sessions/CalendarPanel.vue'
import EntryDialog from '@/components/app/live-sessions/EntryDialog.vue'
import SessionsTable from '@/components/app/live-sessions/SessionsTable.vue'

export default {
  name: 'LiveClasses',

  components: {
    TodayCardsPanel,
    CalendarPanel,
    EntryDialog,
    SessionsTable
  },

  data: () => {
    return {
      mode: 'TODAY',
      today: null
    }
  },

  computed: {
    ...mapState('live-sessions', ['sessions']),

    days () {
      if (this.today) {
        const today = new Date(this.today)
        const monday = new Date(this.today)
        const friday = new Date(this.today)

        if (today.getDay() === 6 || today.getDay() === 0) {
          // Get next week
          monday.setDate(today.getDate() + (7 - today.getDay()) % 7 + 1)
          friday.setDate(today.getDate() + (7 - today.getDay()) % 7 + 5)
        } else {
          // Get current week
          monday.setDate(today.getDate() - (today.getDay() - 1))
          friday.setDate(today.getDate() - (today.getDay() - 5))
        }

        monday.setHours(0, 0, 0, 0)
        friday.setHours(23, 59, 59, 999)

        return {
          monday,
          friday
        }
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
    const today = new Date()
    this.today = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${(today.getDate()).toString().padStart(2, '0')}`
    this.getUserLiveSessions(this.days)
  },

  methods: {
    ...mapActions('live-sessions', ['getUserLiveSessions'])
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
  &-daily{
    height: 100%;
    max-height: 100%;
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
</style>
