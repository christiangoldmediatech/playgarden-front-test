<template>
  <div class="fill-height d-flex flex-column">
    <div class="lsess-daily-container">
      <div class="lsess-daily-card pt-4">
        <div class="mx-0 pl-6">
          <span class="lsess-title">{{ $t('liveClasses.todayCardPanel.filter') }}</span>
          <v-radio-group v-model="radio" @change="$emit('change', $event)">
            <v-radio label="All classes" value="all" color="#8CD2FF">
              <template #label>
                <span>{{ $t('liveClasses.todayCardPanel.allClasses') }}</span>
              </template>
            </v-radio>
            <v-radio label="Live Classes" value="liveClasses" color="#8CD2FF">
              <template #label>
                <span class="pg-text-[#F89838]">{{ $t('liveClasses.todayCardPanel.liveClasses') }}</span>
              </template>
            </v-radio>
            <v-radio label="Playdates" value="playdates" color="#8CD2FF">
              <template #label>
                <span class="pg-text-[#68C453]">{{ $t('liveClasses.todayCardPanel.playdates') }}</span>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
        <v-row
          class="mx-3 mb-7 mt-2 py-2 ml-4 pl-2 pg-border-b-2 pg-border-t-2 pg-border-[#C8C8C8] pg-border-dashed pg-border-l-0 pg-border-r-0 pg-cursor-pointer"
          align="center"
          justify="start"
          @click="goToMyPlaydates"
        >
          <img class="mr-3" src="@/assets/svg/camera.svg" />
          <span class="lsess-title !pg-font-normal">{{ $t('liveClasses.todayCardPanel.myPlaydates') }}</span>
        </v-row>
        <v-row class="mx-0 pl-5" align="center" justify="start">
          <img class="mr-3" src="@/assets/svg/sessions-camera.svg" />
          <span class="lsess-title">{{ $t('liveClasses.todayCardPanel.nextClasses') }}</span>
        </v-row>

        <v-row class="mx-0 lsess-schedule-container">
          <v-col cols="12" class="pl-2 pr-3 lsess-schedule-container-col">
            <template v-if="nextSessions.length > 0">
              <template v-if="$vuetify.breakpoint.smAndDown">
                <today-card
                  v-for="i in nextSessions"
                  :key="`today-card-${i.id}`"
                  :entry="i"
                  :block="block"
                />
              </template>

              <perfect-scrollbar v-else>
                <today-card
                  v-for="i in nextSessions"
                  :key="`today-card-${i.id}`"
                  :entry="i"
                  :block="block"
                />
              </perfect-scrollbar>
            </template>

            <template v-else>
              <div class="my-10 lsess-title text-center">
                {{ $t('liveClasses.todayCardPanel.pending1') }}
                {{ hasPlayAndLearnPlan ? $t('liveClasses.todayCardPanel.pending2') : '' }} {{ $t('liveClasses.todayCardPanel.pending3') }}
              </div>
            </template>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import dayjs from 'dayjs'

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
    },
    type: {
      type: String,
      required: false,
      default: 'all'
    }
  },

  data() {
    return {
      radio: 'all'
    }
  },

  computed: {
    ...mapState('live-sessions', ['sessions']),
    ...mapGetters('auth', ['hasPlayAndLearnPlan']),

    nextSessions() {
      const today = new Date()
      const filtered = this.sessions.filter((session) => {
        if (!this.userHasAccess(session)) {
          return false
        }

        const end = new Date(session.dateEnd)
        return today < end
      })

      const sorted = filtered.sort((a, b) => {
        const dateA = new Date(a.dateStart)
        const dateB = new Date(b.dateStart)

        return dateA.getTime() - dateB.getTime()
      })

      return sorted
    }
  },

  mounted() {
    this.radio = this.type
  },

  methods: {
    userHasAccess(entry) {
      const day = dayjs(entry.dateStart).day()
      return (
        !this.hasPlayAndLearnPlan ||
        (this.hasPlayAndLearnPlan && (day === 0 || day === 6))
      )
    },
    goToMyPlaydates() {
      this.$router.push({ name: 'app-live-classes-my-playdates' })
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
    background-color: #b2e68d;
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
    background-color: #b2e68d;
    width: 6px;
  }
}
</style>
