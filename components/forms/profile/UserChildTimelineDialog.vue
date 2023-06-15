<template>
  <pg-dialog v-model="dialog" content-class="elevation-0">
    <v-col>
      <v-row justify="center">
        <v-card width="80vh" max-width="90%" elevation="0" color="transparent">
          <v-row justify="end" class="py-3">
            <v-btn
              class="timeline-close-btn"
              color="white"
              icon
              @click.stop="dialog = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
        </v-card>
      </v-row>

      <v-row justify="center">
        <v-card width="80vh" height="60vh" max-width="90%" class="pt-3">
          <template v-if="child">
            <div class="timeline-header pl-2 pl-md-9">
              <span class="timeline-name">
                {{ child.firstName }}{{ $t('account.student.timeline') }}
              </span>

              <div class="timeline-letter-selector pr-2 pr-md-9 pt-2">
                <letter-select
                  v-model="selectedLetter"
                  clearable
                  small-letter
                />
              </div>
            </div>

            <div v-if="loading" class="timeline-loading">
              <v-progress-circular
                width="12"
                size="128"
                color="accent"
                indeterminate
              />
            </div>
            <div v-else-if="entries.length === 0" class="timeline-loading">
              <div class="timeline-content-title">
                {{
                  `${child.firstName} has not yet started${
                    selectedLetter ? " on this letter" : ""
                  }.`
                }}
              </div>
            </div>

            <perfect-scrollbar v-else>
              <div class="timeline-content">
                <div class="timeline-content-line" />

                <div
                  v-for="(entry, i) in entries"
                  :key="`timeline-entry-${i}`"
                  class="timeline-content-row"
                >
                  <div class="timeline-content-circle">
                    <pg-circle-letter-day
                      class="clickable"
                      :day="entry.day"
                      :letter="entry.curriculumType.letter"
                      :size="64"
                      no-auto-position
                      @click.native="openLesson(entry.id)"
                    />
                  </div>

                  <div>
                    <div class="timeline-content-title clickable" @click="openLesson(entry.id)">
                      {{ entry.description }}
                    </div>

                    <div class="timeline-content-status">
                      {{ getStatus(entry) }}
                    </div>
                  </div>
                </div>
              </div>
            </perfect-scrollbar>
          </template>
        </v-card>
      </v-row>
    </v-col>
  </pg-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import LetterSelect from '@/components/app/live-sessions/recorded/LetterSelect.vue'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

export default {
  name: 'UserChildTimelineDialog',

  components: {
    LetterSelect,
    PerfectScrollbar
  },

  data: () => {
    return {
      dialog: false,
      loading: false,
      child: null,
      selectedLetter: null,
      timeline: []
    }
  },

  computed: {
    entries () {
      if (this.selectedLetter) {
        return this.timeline.filter((entry) => {
          return entry.curriculumType.id === this.selectedLetter
        })
      }
      return this.timeline
    }
  },

  watch: {
    dialog (val) {
      if (val) {
        document.querySelector('html').style.overflowY = 'hidden'
      } else {
        document.querySelector('html').style.overflowY = 'scroll'
      }
    }
  },

  created () {
    this.$nuxt.$on('open-timeline', (child) => {
      this.timeline = []
      this.selectedLetter = null
      this.child = child
      this.loading = true
      this.getLessonChildTimeline(child.id).then((data) => {
        this.timeline = data
        this.loading = false
      })
      this.dialog = true
    })
  },

  methods: {
    ...mapActions('children/lesson', ['getLessonChildTimeline']),

    getStatus (entry) {
      if (entry.dateFinished) {
        const date = new Date(entry.dateFinished)
        const month = date.toLocaleString('default', { month: 'long' })

        return `Done on ${month} ${date
          .getDate()
          .toString()
          .padStart(2, '0')}, ${date.getFullYear()}`
      } else if (entry.dateStarted) {
        const date = new Date(entry.dateStarted)
        const month = date.toLocaleString('default', { month: 'long' })

        return `Started on ${month} ${date
          .getDate()
          .toString()
          .padStart(2, '0')}, ${date.getFullYear()}`
      }
      return 'Not started.'
    },

    openLesson (lessonId) {
      this.$nuxt.$emit('open-lesson-overlay', {
        childId: this.child.id,
        lessonId
      })
    }
  }
}
</script>

<style lang="scss">
.timeline {
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-name {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.5;
    color: #484848;
  }
  &-letter-selector {
    max-width: 240px;
  }
  &-loading {
    height: calc(100% - 72px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 32px;
    padding-bottom: 32px;
    & svg circle {
      color: #f89838 !important;
    }
  }
  &-content {
    position: relative;
    &-line {
      position: absolute;
      width: 2px;
      height: 100%;
      left: 63px;
      background-color: #dbdbdb;
    }
    &-row {
      position: relative;
      padding-top: 20px;
      padding-bottom: 20px;
      margin-bottom: 27px;
      padding-left: 30px;
      padding-right: 8px;
      display: flex;
      align-items: center;
      z-index: 10;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    &-circle {
      margin-right: 16px;
    }
    &-title {
      font-size: 16px;
      line-height: 1.5;
      font-weight: 600;
      color: #484848;
    }
    &-status {
      font-size: 12px;
      line-height: 1.5;
      font-weight: 300;
      color: #484848;
    }
  }
}
.fullscreen {
  width: 100% !important;
  height: 100% !important;
}

.vh-container {
  min-height: 120vh;
}
.vh-row {
  min-height: 96vh;
  max-height: 180vh;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.68) !important;
}
</style>

<style lang="scss" scoped>
::v-deep {
  .ps {
    position: relative;
    width: 100%;
    height: calc(100% - 72px);
    max-height: calc(100% - 72px);
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
    width: 9px;
    border-radius: 9px;
    margin: 0px 0px;
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
    width: 9px;
    /* there must be 'right' for ps__thumb-y */
    right: 1px;
    /* please don't change 'position' */
    position: absolute;
  }

  .ps__rail-y:hover > .ps__thumb-y,
  .ps__rail-y:focus > .ps__thumb-y,
  .ps__rail-y.ps--clicking .ps__thumb-y {
    background-color: #B2E68D;
    width: 9px;
  }
}
</style>
