<template>
  <v-card class="lclass-calendar mx-2">
    <!-- Current Day Section -->
    <div class="lclass-calendar-days">
      <div
        v-for="(weekDay, i) in weekDays"
        :key="`days-row-day-${i}`"
        class="lclass-calendar-day"
      >
        <div>
          {{ weekDay }}
        </div>
        <div v-if="isTodayInThisWeek && today.getDay() === (i + 1)" class="lclass-calendar-day-bar" />
      </div>
    </div>

    <!-- Hours -->
    <div class="lclass-calendar-hours">
      <template v-for="(i, hourIndex) in ((endHour - startHour) + 1)">
        <div
          :key="`hour-${hourIndex}`"
          :style="{ '--entriesLength': findMaxEntriesForHour(hourIndex) }"
          class="lclass-calendar-hour"
        >
          <div class="lclass-calendar-hour-time">
            {{ (startHour + hourIndex).toString().padStart('0', 2) }}:00
          </div>

          <div
            v-for="(j, dayIndex) in 5"
            :key="`hour-${hourIndex}-day-${dayIndex}`"
            class="lclass-calendar-hour-day"
          >
            <table-entry
              v-for="(entry, entryIndex) in getAdvancedSchedule.days[dayIndex][hourIndex]"
              :id="`entry-${dayIndex}-${hourIndex}-${entryIndex}`"
              :key="`entry-${dayIndex}-${hourIndex}-${entryIndex}`"
              :entry="entry"
              edit-mode
            />
          </div>
        </div>
      </template>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getMondayFriday, isTodayInThisWeek } from '@/utils/dateTools'
import TableEntry from '@/components/app/live-sessions/TableEntry.vue'
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default {
  name: 'CalendarView',

  components: {
    TableEntry
  },

  props: {
    day: {
      type: Date,
      required: true
    }
  },

  data: () => {
    return {
      weekDays,
      today: new Date()
    }
  },

  computed: {
    ...mapGetters('live-sessions', ['getAdvancedSchedule']),

    startHour () {
      return this.getAdvancedSchedule.firstHour
    },

    endHour () {
      return this.getAdvancedSchedule.endHour
    },

    days () {
      return getMondayFriday(this.day)
    },

    isTodayInThisWeek () {
      return isTodayInThisWeek(this.today, this.days)
    }
  },

  watch: {
    days () {
      this.getSessions()
    }
  },

  created () {
    this.getSessions()
    this.$nuxt.$on('update-calendar', this.getSessions)
  },

  beforeDestroy () {
    this.$nuxt.$off('update-calendar')
  },

  methods: {
    ...mapActions('live-sessions', ['getUserLiveSessions']),

    getSessions () {
      this.$emit('loading', true)
      this.getUserLiveSessions({ ...this.days, admin: true }).then(() => {
        this.$emit('loading', false)
      })
    },

    findMaxEntriesForHour (hourIndex) {
      let total = 1
      this.getAdvancedSchedule.days.forEach((day) => {
        if (day && day[hourIndex] && day[hourIndex].length > total) {
          total = day[hourIndex].length
        }
      })
      return total
    }
  }
}
</script>

<style lang="scss">
.lclass-calendar {
  width: 100%;
  &.v-sheet.v-card {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px -4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  &-days {
    display: flex;
    padding: 16px 0px;
    padding-left: 74px;
  }
  &-day {
    width: 20%;
    height: 36px;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-bar {
      width: 108px;
      height: 3px;
      background-color: #8AB591;
    }
  }
  &-hour {
    position: relative;
    padding-left: 74px;
    height: calc(var(--entriesLength) * 160px);
    max-height: calc(var(--entriesLength) * 160px);
    display: flex;
    align-items: center;
    border-top: 2px solid #F2F2F2;
    &-time {
      // position: absolute;
      position: absolute;
      left: 0px;
      width: 74px;
      text-align: center;
      // top: calc(50% - 13.5px);
      font-size: 18px;
      font-weight: 400;
      line-height: 1.5px;
    }
    &-day {
      width: 20%;
      max-width: 20%;
      padding: 8px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
  }
}
</style>
