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
          v-if="hourIndex >= skipRows"
          :key="`hour-${hourIndex}`"
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
              v-if="getWeeklySchedule[dayIndex][hourIndex]"
              :id="`entry-${dayIndex}-${hourIndex}`"
              :entry="getWeeklySchedule[dayIndex][hourIndex]"
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
      startHour: 8,
      endHour: 18,
      skipRows: 0,
      today: new Date()
    }
  },

  computed: {
    // ...mapState('live-sessions', ['sessions']),
    ...mapGetters('live-sessions', ['getWeeklySchedule']),

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
    },

    getWeeklySchedule (val) {
      const totalClasses = val.reduce((accumulator, day) => {
        const hourResult = day.reduce((accumulator2, hour) => {
          return accumulator2 + Number(Boolean(hour))
        }, 0)
        return accumulator + hourResult
      }, 0)

      let newSkipRows = 0

      if (totalClasses > 0) {
        for (let hourIndex = 0; hourIndex < 2; hourIndex++) {
          let hourClasses = 0
          for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            hourClasses += Number(Boolean(val[dayIndex][hourIndex]))
          }
          if (hourClasses === 0) {
            newSkipRows++
          } else {
            break
          }
        }
      }
      this.skipRows = newSkipRows
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
      this.getUserLiveSessions(this.days).then(() => {
        this.$emit('loading', false)
      })
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
    height: 160px;
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
    }
  }
}
</style>
