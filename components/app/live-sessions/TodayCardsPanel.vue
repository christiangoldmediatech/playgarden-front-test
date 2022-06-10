<template>
  <div class="fill-height d-flex flex-column">
    <div class="lsess-daily-container">
      <v-card class="lsess-daily-card pt-4">
        <v-row class="mx-0" align="center" justify="center">
          <img class="mr-3" src="@/assets/svg/sessions-camera.svg">
          <span class="lsess-title">Live Class Schedule</span>
        </v-row>

        <v-row class="mx-0 lsess-schedule-container">
          <v-col cols="12" class="pl-2 pr-3 lsess-schedule-container-col">
            <template v-if="nextSessions.length > 0">
              <template v-if="$vuetify.breakpoint.smAndDown">
                <today-card v-for="i in nextSessions" :key="`today-card-${i.id}`" :entry="i" :block="block" />
              </template>

              <perfect-scrollbar v-else>
                <today-card v-for="i in nextSessions" :key="`today-card-${i.id}`" :entry="i" :block="block" />
              </perfect-scrollbar>
            </template>

            <template v-else>
              <div class="my-10 lsess-title text-center">
                There are no pending events for this week.
              </div>
            </template>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <v-btn
      class="lsess-calendar-btn text-none font-weight-bold flex-shrink-1 flex-grow-0"
      block
      color="grey lighten-5"
      solo
      x-large
      @click="$emit('mode-change')"
    >
      Calendar
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

import TodayCard from './TodayCard.vue'

export default {
  name: 'TodayCardsPanel',

  components: {
    PerfectScrollbar,
    TodayCard
  },

  props: {
    block: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapState('live-sessions', ['sessions']),

    nextSessions () {
      const today = new Date()
      const filtered = this.sessions.filter(({ dateStart, dateEnd }) => {
        const end = new Date(dateEnd)

        return today < end
      })

      const sorted = filtered.sort((a, b) => {
        const dateA = new Date(a.dateStart)
        const dateB = new Date(b.dateStart)

        return dateA.getTime() - dateB.getTime()
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
      height: 100%;
      max-height: calc(100% - 64px);
      @media screen and (max-width: 959px) {
        margin-bottom: 12px;
      }
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
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    overflow-anchor: none;
    -ms-overflow-style: none;
    touch-action: auto;
    -ms-touch-action: auto;
    padding-bottom: 24px;
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
    background-color: #B2E68D;
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
    background-color: #B2E68D;
    width: 6px;
  }
}
</style>
