<template>
  <div class="lsess-table">
    <div class="lsess-table-container">
      <div v-if="!dayMode" class="pl-16 pr-8">
        <v-row class="my-0">
          <v-col
            v-for="(day, index) in days"
            :key="`days-row-column-${index}`"
            class="lsess-table-col lsess-table-col-header"
          >
            {{ day }}
            <div
              v-if="index === activeDay"
              class="lsess-table-col-header-active"
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
                There are no live classes programmed for this day.
              </v-card-text>
            </v-card>
          </template>
          <template v-else>
            <div
              v-for="hour in totalHours"
              :key="`hour-${hour}`"
              class="lsess-table-hour-row"
              :style="{ '--rowHeightFactor': findMaxEntriesForHour(hour - 1) }"
            >
              <div
                class="d-flex align-center justify-center lsess-table-offset"
              >
                {{ hourOffset + hour }}:00
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
          <div
            v-for="hour in totalHours"
            :key="`hour-${hour}`"
            class="lsess-table-hour-row"
            :style="{ '--rowHeightFactor': findMaxEntriesForHour(hour - 1) }"
          >
            <div class="d-flex align-center justify-center lsess-table-offset">
              {{ hourOffset + hour }}:00
            </div>
            <v-row justify="center">
              <template>
                <v-col
                  v-for="(day, dayIndex) in days"
                  :key="`days-row-${hour}-column-${dayIndex}`"
                  class="lsess-table-col"
                  :style="{
                    '--entriesLength':
                      getAdvancedSchedule.days[dayIndex][hour - 1].length || 1
                  }"
                >
                  <template
                    v-if="
                      getAdvancedSchedule.days[dayIndex] &&
                        getAdvancedSchedule.days[dayIndex][hour - 1].length
                    "
                  >
                    <table-entry
                      v-for="(entry, entryIndex) in getAdvancedSchedule.days[
                        dayIndex
                      ][hour - 1]"
                      :id="`entry-${activeDay}-${hour - 1}-${entryIndex}`"
                      :key="`entry-${activeDay}-${hour - 1}-${entryIndex}`"
                      :block="block"
                      v-bind="{ entry }"
                    />
                  </template>
                </v-col>
              </template>
            </v-row>
          </div>
        </template>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import TableEntry from './TableEntry.vue'

export default {
  name: 'SessionsTable',

  components: {
    PerfectScrollbar,
    TableEntry
  },

  props: {
    today: {
      type: String,
      required: true
    },
    dayMode: {
      type: Boolean,
      required: false
    },
    block: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      selectedDay: null,
      scrolling: false
    }
  },

  computed: {
    ...mapGetters('live-sessions', ['getAdvancedSchedule']),

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
    }
  },

  watch: {
    getAdvancedSchedule() {
      this.scrollToFirst()
    },

    activeDay() {
      this.scrollToFirst()
    }
  },

  mounted() {
    this.scrollToFirst()
  },

  methods: {
    scrollToFirst() {
      if (this.scrolling || this.activeDay < 0 || this.activeDay > 6) {
        return
      }

      this.scrolling = true

      const waitToFinish = window.setTimeout(() => {
        const scrollArea = document.querySelector('#scrollArea')
        const day = this.getAdvancedSchedule.days[this.activeDay]
        if (scrollArea && day) {
          scrollArea.scrollTop = 0
          const index = day.findIndex(hour => hour.length)

          if (index >= 0) {
            const entry = document.querySelector(
              `#entry-${this.activeDay}-${index}-0`
            )
            if (entry) {
              let offset = entry.offsetTop - 64
              if (offset < 0) {
                offset = 0
              }
              scrollArea.scroll({
                top: offset,
                behaviour: 'smooth'
              })
            }
          }
          window.clearInterval(waitToFinish)
          this.scrolling = false
        }
      }, 50)
    },

    noEntries(day) {
      if (day) {
        return day.findIndex(hour => hour.length) === -1
      }
      return true
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
}
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
        font-size: 1.1rem;
        line-height: 1.5;
        text-align: center;
        max-height: 160px;
        &-active {
          width: 75%;
          height: 3px;
          margin: 0 auto;
          margin-top: 8px;
          background-color: #8ab591;
          border-radius: 3px;
        }
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
</style>
