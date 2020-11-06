<template>
  <div class="fill-height d-flex flex-column">
    <div class="lsess-daily-container pb-8">
      <v-card class="lsess-daily-card pt-4">
        <v-row class="mx-0" align="center" justify="center">
          <img class="mr-3" src="/svg/sessions-camera.svg">
          <span class="lsess-title">Live Sessions Schedule</span>
        </v-row>

        <v-row class="mx-0 lsess-schedule-container">
          <v-col cols="12" class="pl-2 pr-3 lsess-schedule-container-col">
            <perfect-scrollbar>
              <today-card v-for="i in nextSessions" :key="`today-card-${i.id}`" :entry="i" />
            </perfect-scrollbar>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <v-btn
      class="lsess-calendar-btn text-none font-weight-bold flex-shrink-1 flex-grow-0"
      color="white"
      block
      solo
      x-large
      @click="$emit('mode-change')"
    >
      Calendar
    </v-btn>
  </div>
</template>

<script>
import { translateUTC } from '@/utils/dateTools.js'
import { mapState } from 'vuex'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default {
  name: 'TodayCardsPanel',

  components: {
    PerfectScrollbar
  },

  computed: {
    ...mapState('live-sessions', ['sessions']),

    nextSessions () {
      const today = dayjs()
      const filtered = this.sessions.filter(({ dateEnd }) => {
        const date = translateUTC(dateEnd)
        return today.unix() < date.unix()
      })

      const sorted = filtered.sort((a, b) => {
        const dateA = translateUTC(a.dateStart)
        const dateB = translateUTC(b.dateStart)

        return dateA - dateB
      })

      return sorted
    }
  }
}
</script>

<style lang="scss">
.lsess {
  &-daily {
    &-container {
      height: calc(100% - 24px);
      max-height: calc(100% - 24px);
    }
    &-card {
      height: calc(100% - 30px);
      max-height: calc(100% - 30px);
    }
  }
  &-schedule-container {
    height: calc(100% - 50px);
    max-height: calc(100% - 50px);
    &-col {
      height: 100%;
      max-height: 100%;
    }
  }
}
</style>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"></style>

<style lang="scss" scoped>
::v-deep {
  .ps {
    position: relative;
    width: 100%;
    max-height: 100%;
    overflow: hidden;
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
    width: 8px;
    border-radius: 8px;
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
    background-color: #dce7b5;
    border-radius: 14px;
    transition: none;
    width: 6px;
    /* there must be 'right' for ps__thumb-y */
    right: 1px;
    /* please don't change 'position' */
    position: absolute;
  }

  .ps__rail-y:hover > .ps__thumb-y,
  .ps__rail-y:focus > .ps__thumb-y,
  .ps__rail-y.ps--clicking .ps__thumb-y {
    background-color: #dce7b5;
    width: 6px;
  }
}
</style>
