<template>
  <div class="lsess-table">
    <div id="sessions-table-container" class="lsess-table-container">
      <div v-if="!dayMode" class="pl-16 pr-8">
        <v-row class="my-0">
          <v-col
            v-for="(day, index) in getDaysFormatted"
            :key="`days-row-column-${index}`"
            class="lsess-table-col lsess-table-col-header d-flex align-center justify-center"
            :class="{ 'active-day': index === activeDay }"
          >
            <span class="pg-relative pg-z-10">{{ day.name }}</span>
            <holiday-card
              v-if="day.holiday"
              :holiday="day.holiday"
              :height="holidaysWeekHeight"
              top-position="45px"
              holiday-type="week"
            />
          </v-col>
        </v-row>
      </div>

      <div v-if="dayMode" class="my-7" />

      <perfect-scrollbar id="scrollArea">
        <!-- Day mode rendering logic -->
        <template v-if="dayMode">
          <template v-if="noEntries(getAdvancedSchedule.days[activeDay])">
            <!-- No entries found for this day -->
            <v-card>
              <v-card-text class="text-h6 text-center">
                {{ $t('liveClasses.sessionsTable.noLiveClasses') }}
              </v-card-text>
            </v-card>
          </template>
          <template v-else>
            <holiday-card
              v-if="holidayForDay"
              :holiday="holidayForDay.holiday"
              :height="holidaysDayHeight"
              top-position="0"
              holiday-type="day"
            />
            <div
              v-for="hour in totalHours"
              :key="`hour-${hour}`"
              class="lsess-table-hour-row"
              :style="{ '--rowHeightFactor': findMaxEntriesForHour(hour - 1) }"
            >
              <div
                class="d-flex align-center justify-center lsess-table-offset"
              >
                <span class="hour">
                  {{ getHourNoMilitaryTime(hourOffset + hour) }} {{ getAmOrPm(hourOffset + hour) }}
                </span>
              </div>
              <v-row justify="center">
                <template v-if="dayMode">
                  <v-col class="lsess-table-day">
                    <template
                      v-if="
                        activeDay >= 0 &&
                          getAdvancedSchedule.days[activeDay] &&
                          getAdvancedSchedule.days[activeDay][hour - 1].length
                      "
                    >
                      <table-entry
                        v-for="(entry, entryIndex) in getAdvancedSchedule.days[
                          activeDay
                        ][hour - 1]"
                        :id="`entry-${activeDay}-${hour - 1}-${entryIndex}`"
                        :key="`entry-${activeDay}-${hour - 1}-${entryIndex}`"
                        :block="block"
                        v-bind="{ entry }"
                        :disable-open-dialog="disableOpenDialog"
                      />
                    </template>
                  </v-col>
                </template>
              </v-row>
            </div>
          </template>
        </template>

        <!-- Week mode rendering logic -->
        <template v-else>
          <template v-for="hour in totalHours">
            <div
              v-if="
                getAdvancedSchedule &&
                  getAdvancedSchedule.days &&
                  getAdvancedSchedule.days.length > 0
              "
              :key="`hour-${hour}`"
              class="lsess-table-hour-row"
              :style="{ '--rowHeightFactor': findMaxEntriesForHour(hour - 1) }"
            >
              <div
                class="d-flex align-center justify-center lsess-table-offset"
              >
                <span class="hour">
                  {{ getHourNoMilitaryTime(hourOffset + hour) }} :00 {{ getAmOrPm(hourOffset + hour) }}
                </span>
              </div>
              <v-row justify="center">
                <template>
                  <v-col
                    v-for="(day, dayIndex) in days"
                    :key="`days-row-${hour}-column-${dayIndex}`"
                    class="lsess-table-col"
                    :style="{
                      '--entriesLength':
                        getAdvancedSchedule.days[dayIndex + (disableWeekends ? 1 : 0)][hour - 1].length || 1
                    }"
                  >
                    <template
                      v-if="
                        getAdvancedSchedule.days[dayIndex + (disableWeekends ? 1 : 0)] &&
                          getAdvancedSchedule.days[dayIndex + (disableWeekends ? 1 : 0)][hour - 1].length
                      "
                    >
                      <table-entry
                        v-for="(entry, entryIndex) in getAdvancedSchedule.days[
                          dayIndex + (disableWeekends ? 1 : 0)
                        ][hour - 1]"
                        :id="`entry-${activeDay}-${hour - 1}-${entryIndex}`"
                        :key="`entry-${activeDay}-${hour - 1}-${entryIndex}`"
                        :block="block"
                        v-bind="{ entry }"
                        :disable-open-dialog="disableOpenDialog"
                      />
                    </template>
                  </v-col>
                </template>
              </v-row>
            </div>
          </template>
        </template>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import dayjs from 'dayjs'
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { useLanguageHelper } from '@/composables'
import TableEntry from './TableEntry.vue'
import HolidayCard from './HolidayCard.vue'

export default defineComponent({
  name: 'SessionsTable',

  components: {
    PerfectScrollbar,
    TableEntry,
    HolidayCard
  },

  props: {
    today: {
      type: String,
      required: true
    },
    startAndEndDate: {
      type: Object,
      required: false,
      default: () => {}
    },
    dayMode: {
      type: Boolean,
      required: false
    },
    block: {
      type: Boolean,
      required: false,
      default: false
    },
    holidays: {
      type: Array,
      default: () => []
    },
    disableOpenDialog: {
      type: Boolean,
      default: false
    },
    disableWeekends: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const holidaysWeekHeight = ref('0px')
    const holidaysDayHeight = ref('0px')
    const language = useLanguageHelper()

    const startDate = computed(() => {
      if (props.startAndEndDate) {
        const sunday = dayjs(props.startAndEndDate.sunday)
        return sunday
      }
      return null
    })

    const days = ref([
      language.t('liveClasses.days.sunday') + ' ' + startDate.value.add(0, 'day').date(),
      language.t('liveClasses.days.monday') + ' ' + startDate.value.add(1, 'day').date(),
      language.t('liveClasses.days.tuesday') + ' ' + startDate.value.add(2, 'day').date(),
      language.t('liveClasses.days.wednesday') + ' ' + startDate.value.add(3, 'day').date(),
      language.t('liveClasses.days.thursday') + ' ' + startDate.value.add(4, 'day').date(),
      language.t('liveClasses.days.friday') + ' ' + startDate.value.add(5, 'day').date(),
      language.t('liveClasses.days.saturday') + ' ' + startDate.value.add(6, 'day').date()
    ])

    const resizeOb = ref(
      new ResizeObserver(function(entries) {
        const scrollArea = entries.find(
          (entry) => entry.target.id === 'scrollArea'
        )
        const sessionsTable = entries.find(
          (entry) => entry.target.id === 'sessions-table-container'
        )

        if (sessionsTable) {
          holidaysWeekHeight.value = `${sessionsTable.contentRect.height}px`
        }

        if (scrollArea) {
          holidaysDayHeight.value = `${scrollArea.contentRect.height}px`
        }
      })
    )

    const setObserver = () => {
      const tableContainer = document.getElementById('sessions-table-container')
      const scrollArea = document.getElementById('scrollArea')
      if (tableContainer) {
        resizeOb.value.observe(tableContainer)
      }

      if (scrollArea) {
        resizeOb.value.observe(scrollArea)
      }
    }

    const unsetObserver = () => {
      const tableContainer = document.getElementById('sessions-table-container')
      const scrollArea = document.getElementById('scrollArea')
      if (tableContainer) {
        resizeOb.value.unobserve(tableContainer)
      }

      if (scrollArea) {
        resizeOb.value.observe(scrollArea)
      }
    }

    return { days, holidaysWeekHeight, holidaysDayHeight, setObserver, unsetObserver, language, startDate }
  },

  data: () => {
    return {
      selectedDay: null,
      scrolling: false
    }
  },

  computed: {
    ...mapGetters('live-sessions', ['getAdvancedSchedule']),
    ...mapState('live-sessions', ['advancedSchedule']),

    hourOffset() {
      return this.getAdvancedSchedule.firstHour - 1
    },

    totalHours() {
      return (
        this.getAdvancedSchedule.endHour -
        (this.hourOffset > 0 ? this.hourOffset : 1)
      )
    },

    activeDay() {
      const parts = this.today.split('-')
      const date = new Date()
      date.setFullYear(parts[0])
      date.setMonth(parts[1] - 1)
      date.setDate(parts[2])
      return date.getDay()
    },

    getDaysFormatted() {
      if (this.disableWeekends) {
        return this.days.map((day, index) => ({
          name: day,
          holiday: this.holidaysFormatted.find(
            (holiday) => holiday.day === index + 1
          )
        }))
      } else {
        return this.days.map((day, index) => ({
          name: day,
          holiday: this.holidaysFormatted.find(
            (holiday) => holiday.day === index
          )
        }))
      }
    },

    holidaysFormatted() {
      return this.holidays.map((holiday) => ({
        day: dayjs(holiday.dateStart).get('day'),
        cols:
          dayjs(holiday.dateEnd).get('date') -
          dayjs(holiday.dateStart).get('date') +
          1,
        ...holiday
      }))
    },

    holidayForDay() {
      const currentDate = dayjs(this.today)
      return this.getDaysFormatted.find((day) => {
        if (!day.holiday) {
          return false
        }

        const startDate = dayjs(day.holiday.dateStart)
        const endDate = dayjs(day.holiday.dateEnd)
        return (
          startDate.get('date') <= currentDate.get('date') &&
          currentDate.get('date') <= endDate.get('date')
        )
      })
    }
  },

  watch: {
    getAdvancedSchedule() {
      this.scrollToFirst()
      this.$store.commit(
        'live-sessions/SET_ADVANCED_SCHEDULE',
        this.disableWeekends
          ? {
              ...this.getAdvancedSchedule,
              days: this.getAdvancedSchedule.days.slice(1)
            }
          : this.getAdvancedSchedule
      )
    },

    activeDay() {
      this.scrollToFirst()
    }
  },

  created() {
    if (this.disableWeekends) {
      this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      // Remove first element from array
    }
  },

  mounted() {
    this.scrollToFirst()
    this.setObserver()
  },

  unmounted() {
    this.unsetObserver()
  },

  methods: {
    getHourNoMilitaryTime(hour) {
      if (hour === 0) {
        return 12
      } else if (hour > 12) {
        return hour - 12
      } else {
        return hour
      }
    },

    getAmOrPm(hour) {
      return (hour > 12) ? 'pm' : 'am'
    },
    getHolidayForDay(dayIndex) {
      return this.holidaysFormatted.find((holiday) => holiday.day === dayIndex)
    },
    scrollToFirst() {
      if (this.scrolling || this.activeDay < 0 || this.activeDay > 6) {
        return
      }

      this.scrolling = true

      const waitToFinish = window.setTimeout(() => {
        const scrollArea = document.querySelector('#scrollArea')
        const day = this.getAdvancedSchedule.days[this.activeDay]
        if (!scrollArea || !day) {
          return
        }

        scrollArea.scrollTop = 0
        const index = day.findIndex((hour) => hour.length)

        if (index < 0) {
          return
        }

        const entry = document.querySelector(
          `#entry-${this.activeDay}-${index}-0`
        )

        if (!entry) {
          return
        }

        let offset = entry.offsetTop - 64
        if (offset < 0) {
          offset = 0
        }

        scrollArea.scroll({
          top: offset,
          behaviour: 'smooth'
        })

        window.clearInterval(waitToFinish)
        this.scrolling = false
      }, 50)
    },

    noEntries(day) {
      return day ? day.findIndex((hour) => hour.length) === -1 : true
    },

    findMaxEntriesForHour(hourIndex) {
      let total = 1
      this.getAdvancedSchedule.days.forEach((day) => {
        if (day[hourIndex] && day[hourIndex].length > total) {
          total = day[hourIndex].length
        }
      })
      return total
    }
  }
})
</script>

<style lang="scss">
.lsess {
  &-table {
    position: relative;
    height: calc(100% - 50px);
    max-height: calc(100% - 50px);
    &-container {
      position: relative;
      height: calc(100% - 1px);
      max-height: calc(100% - 1px);
    }
    &-offset {
      width: 64px;
      font-size: 1.1rem;
      line-height: 1.5;
    }
    &-col {
      width: 20%;
      display: flex;
      flex-direction: column;
      &-header {
        position: relative;
        font-size: 0.9rem;
        line-height: 1.5;
        text-align: center;
        max-height: 160px;
      }
    }
    &-day {
      width: 90% !important;
      max-width: 90% !important;
      display: flex;
      align-items: center;
    }
    &-hour-row {
      width: calc(100% - 32px);
      border-bottom: solid 2px #f2f2f2;
      display: flex;
      flex-direction: row;
    }
  }
}
</style>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"></style>

<style lang="scss" scoped>
::v-deep {
  // .v-carousel__controls {
  //   display: none;
  // }

  .hour {
    font-size: 12px !important;
  }

  .ps {
    position: relative;
    width: 100%;
    max-height: 90%;
    overflow: hidden !important;
    overflow-anchor: none;
    -ms-overflow-style: none;
    touch-action: auto;
    -ms-touch-action: auto;
  }

  .ps__rail-y {
    display: block;
    opacity: 1;
    background-color: #f2f2f2;
    transition: none;
    width: 16px;
    border-radius: 16px;
    margin: 32px 0px;
    /* there must be 'right' or 'left' for ps__rail-y */
    right: 0;
    /* please don't change 'position' */
    position: absolute;
  }

  .ps:hover > .ps__rail-x,
  .ps:hover > .ps__rail-y,
  .ps--focus > .ps__rail-x,
  .ps--focus > .ps__rail-y,
  .ps--scrolling-x > .ps__rail-x,
  .ps--scrolling-y > .ps__rail-y {
    opacity: 1;
  }

  .ps .ps__rail-x:hover,
  .ps .ps__rail-y:hover,
  .ps .ps__rail-x:focus,
  .ps .ps__rail-y:focus,
  .ps .ps__rail-x.ps--clicking,
  .ps .ps__rail-y.ps--clicking {
    opacity: 1;
  }

  .ps__thumb-y {
    background-color: #b2e68d;
    border-radius: 14px;
    transition: none;
    width: 14px;
    /* there must be 'right' for ps__thumb-y */
    right: 1px;
    /* please don't change 'position' */
    position: absolute;
  }

  .ps__rail-y:hover > .ps__thumb-y,
  .ps__rail-y:focus > .ps__thumb-y,
  .ps__rail-y.ps--clicking .ps__thumb-y {
    background-color: #b2e68d;
    width: 14px;
  }
}

.active-day {
  background-image: url("~@/assets/svg/meetings/day-selected.svg");
  background-position-x: center;
  background-position-y: center;
  background-size: 100% 95%;

  span {
    font-weight: bold;
  }
}
</style>
