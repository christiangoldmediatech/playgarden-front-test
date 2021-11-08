<template>
  <v-overlay
    :class="`${loading ? 'align-center justify-center' : 'align-start justify-start'}`"
    :dark="false"
    :value="isOverlayVisible"
    z-index="2000"
  >
    <v-btn
      class="top-left text-none white--text px-4"
      text
      x-large
      @click.stop="close"
    >
      <v-icon left>
        mdi-less-than
      </v-icon>
      Back
    </v-btn>

    <div class="progress-letter-selector">
      <letter-select
        v-model="selectedLetter"
        small-letter
        dense
        v-bind="{ disabledLetters }"
        :slim-version="$vuetify.breakpoint.xs"
      />
    </div>

    <v-progress-circular
      v-if="loading"
      color="accent"
      indeterminate
      size="128"
      width="8"
    />
    <template v-else>
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <perfect-scrollbar ref="scrollbar">
          <v-container class="panel-container" fill-height fluid>
            <v-row
              class="fill-height flex-nowrap"
              :justify="(currentLetter && currentLetter.name === 'Intro') ? 'center' : undefined"
            >
              <v-col
                v-for="lesson in lessons"
                :key="`curriculum-lesson-progress-${lesson.id}`"
                class="panel-column"
                cols="12"
                sm="7"
                md="6"
                lg="5"
                xl="4"
              >
                <dashboard-panel
                  v-bind="{ lesson, childId: studentId, customOverrides: { lessonId: lesson.id, childId: studentId }, noLinkMode }"
                  display-mode
                />
              </v-col>
              <v-col
                v-for="i in missing"
                :key="`curriculum-lesson-missing-${i}`"
                class="panel-column"
                cols="12"
                sm="7"
                md="6"
                lg="5"
                xl="4"
              >
                <blank-dashboard-panel
                  :letter="(lessons[0]) ? lessons[0].curriculumType.letter : ''"
                  :day="i + lessons.length"
                >
                  <template v-if="i === 1">
                    COME BACK TOMORROW TO UNLOCK THIS DAY
                  </template>
                  <template v-else>
                    COME BACK LATER TO UNLOCK THIS DAY
                  </template>
                </blank-dashboard-panel>
              </v-col>
            </v-row>
          </v-container>
        </perfect-scrollbar>
      </template>
      <template v-else>
        <v-container class="panel-container" fill-height fluid>
          <div class="mobile-panel-container">
            <dashboard-panel
              v-if="currentMobileLesson && typeof currentMobileLesson === 'object'"
              v-bind="{ lesson: currentMobileLesson, customOverrides: { lessonId: currentMobileLesson.id, childId: studentId } }"
              display-mode
            >
              <!-- Previous Day And Next Day Icon -->
              <template #panel-toolbar>
                <v-row justify="space-between">
                  <v-col v-if="shouldShowPreviousDayButton" class="btnLesson">
                    <v-btn class="ml-3" icon @click.stop="previousDay">
                      <img src="@/assets/svg/back-arrow.svg">
                    </v-btn>
                  </v-col>
                  <v-spacer />
                  <v-col v-if="shouldShowNextDayButton" class="btnLesson">
                    <p class="text-right mr-3">
                      <v-btn icon @click.stop="nextDay">
                        <img src="@/assets/svg/next-arrow.svg">
                      </v-btn>
                    </p>
                  </v-col>
                </v-row>
              </template>
            </dashboard-panel>
            <blank-dashboard-panel
              v-else
              :letter="(lessons[0]) ? lessons[0].curriculumType.letter : ''"
              :day="selectedDayIndex + 1"
            >
              <!-- Previous Day And Next Day Icon -->
              <template #panel-toolbar>
                <v-row justify="space-between">
                  <v-col v-if="shouldShowPreviousDayButton" class="btnLesson">
                    <v-btn class="ml-3" icon @click.stop="previousDay">
                      <img src="@/assets/svg/back-arrow.svg">
                    </v-btn>
                  </v-col>
                  <v-spacer />
                  <v-col v-if="shouldShowNextDayButton" class="btnLesson">
                    <p class="text-right mr-3">
                      <v-btn icon @click.stop="nextDay">
                        <img src="@/assets/svg/next-arrow.svg">
                      </v-btn>
                    </p>
                  </v-col>
                </v-row>
              </template>
              <template v-if="currentMobileLesson === -1">
                COME BACK TOMORROW TO UNLOCK THIS DAY
              </template>
              <template v-else>
                COME BACK LATER TO UNLOCK THIS DAY
              </template>
            </blank-dashboard-panel>
          </div>
        </v-container>
      </template>
    </template>
  </v-overlay>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import DashboardPanel from '@/components/app/dashboard/DashboardPanel.vue'
import BlankDashboardPanel from '@/components/app/dashboard/BlankDashboardPanel.vue'
import LetterSelect from '@/components/app/live-sessions/recorded/LetterSelect.vue'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import { mapGetters, mapActions } from 'vuex'
import { usePlanAccessHelpers } from '@/composables'

export default defineComponent({
  name: 'CourseProgressOverlay',
  components: {
    DashboardPanel,
    BlankDashboardPanel,
    PerfectScrollbar,
    LetterSelect
  },
  setup() {
    const { isCurrentLessonUnavailableInPlan } = usePlanAccessHelpers()
    return {
      isCurrentLessonUnavailableInPlan
    }
  },
  data: () => {
    return {
      isOverlayVisible: false,
      selectedDayIndex: 0,
      loading: false,
      selectedLetter: null,
      letters: [],
      lessons: []
    }
  },
  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),

    noLinkMode () {
      return this.$route.name === 'admin-progress-report'
    },

    studentId () {
      if (['app-student-cubby-course-progress', 'admin-progress-report'].includes(this.$route.name)) {
        return this.$route.query.id
      }
      if (this.currentChild && this.currentChild.length > 0) {
        return this.currentChild[0].id
      }
      return null
    },

    currentLetter () {
      return this.letters.find(letter => letter.id === this.selectedLetter)
    },

    missing () {
      // Return 0 if we are currently at the intro lesson
      if (this.currentLetter && this.currentLetter.name === 'Intro') {
        return 0
      }
      return 5 - this.lessons.length
    },

    currentMobileLesson () {
      const index = this.selectedDayIndex
      const total = 5

      if (this.lessons[index]) {
        return this.lessons[index]
      } else if (this.lessons.length > 0) {
        const difference = total - this.lessons.length
        const current = index + 1
        const offset = current + difference
        return total - offset
      }
      return null
    },

    disabledLetters () {
      return this.letters.filter((letter) => {
        return !letter.enabled
      }).map(({ id }) => id)
    },

    shouldShowPreviousDayButton () {
      return this.selectedDayIndex > 0
    },

    shouldShowNextDayButton () {
      return this.selectedDayIndex < 4
    }
  },

  watch: {
    '$vuetify.breakpoint.width' () {
      if (this.$refs.scrollbar && this.$vuetify.breakpoint.mdAndUp) {
        this.$nextTick(() => {
          this.$refs.scrollbar.update()
        })
      }
    },

    '$vuetify.breakpoint.height' () {
      if (this.$refs.scrollbar && this.$vuetify.breakpoint.mdAndUp) {
        this.$nextTick(() => {
          this.$refs.scrollbar.update()
        })
      }
    },

    lessons (val) {
      if (val.length > 0 && this.$refs.scrollbar && this.$vuetify.breakpoint.mdAndUp) {
        this.$nextTick(() => {
          this.$refs.scrollbar.update()
        })
      }
    },
    selectedLetter (val) {
      if (val) {
        this.getAll()
      }
    },
    isCurrentLessonUnavailableInPlan(val) {
      if (val) {
        this.isOverlayVisible = false
      }
    }
  },
  mounted () {
    this.$nuxt.$on('show-curriculum-progress', (curriculumTypeId) => {
      if (this.studentId) {
        if (this.selectedLetter !== curriculumTypeId) {
          this.lessons = []
          this.selectedLetter = curriculumTypeId
        } else {
          this.getAll()
        }
        this.isOverlayVisible = true
        document.querySelector('html').style.overflowY = 'hidden'
      }
    })

    this.$nuxt.$on('close-curriculum-progress', () => {
      if (this.isOverlayVisible) {
        this.close()
        this.$nuxt.$emit('dashboard-panel-update')
      }
    })
  },

  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),

    close () {
      this.isOverlayVisible = false
      this.selectedDayIndex = 0
      document.querySelector('html').style.overflowY = 'auto'
    },

    async fetchChildProgress () {
      const data = await this.getCourseProgressByChildId({
        id: this.studentId
      })
      this.letters = data
    },

    getAll () {
      this.loading = true
      this.fetchChildProgress()
      this.getCourseProgressByChildId({ id: this.studentId, curriculumTypeId: this.selectedLetter }).then((data) => {
        this.lessons = data.map(({ lesson }) => lesson)
        this.loading = false
      })
    },

    nextDay () {
      if (this.selectedDayIndex <= 3) {
        this.selectedDayIndex += 1
      } else {
        this.selectedDayIndex = 0
      }
    },

    previousDay () {
      if (this.selectedDayIndex <= 0) {
        this.selectedDayIndex = 3
      } else {
        this.selectedDayIndex -= 1
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.top-left {
  position: fixed;
  top: 6px !important;
  left: 6px !important;
  z-index: 2400;
}

.panel-column {
  max-width: 471px;
}

.progress-letter-selector {
  position: fixed;
  width: 156px;
  max-width: 156px;
  z-index: 2400;
  margin: 0 auto;
  top: 6px !important;
  right: 6px !important;
  @media screen and (min-width: 600px) {
    left: auto;
    top: 12px !important;
    right: 12px !important;
    width: 256px;
    max-width: 256px;
  }
}
</style>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"></style>

<style lang="scss" scoped>
.panel-container {
  overflow-x: visible;
  @media screen and (max-width: 599px) {
    padding-top: 80px !important;
  }
  @media screen and (max-width: 959px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
    padding-top: 32px;
    padding-bottom: 8px;
    z-index: 2300;
    display: block;
  }
  @media screen and (min-width: 960px) {
    padding-top: 38px;
  }
}

.mobile-panel-container {
  height: calc(100% - 48px);
  max-width: 100vw;
  max-height: calc(100% - 48px);
  padding-bottom: 12px;
  display: flex;
  justify-content: center;
}

::v-deep {
  .ps {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100vh - 16px);
    max-height: calc(100vh - 16px);
    padding-top: 32px;
    padding-bottom: 16px;
    overflow: auto;
    z-index: 2300;
  }

  .ps__rail-x {
    background-color: #F2EDED;
    transition: none;
    margin-left: 15%;
    margin-right: 15%;
    border-radius: 8px;
    opacity: 1;
    height: 16px;
  }

  .ps--active-x > .ps__rail-x,
  .ps--active-y > .ps__rail-y {
    display: block;
    background-color: #F2EDED;
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
    background-color: #F2EDED;
    opacity: 1;
  }

  .ps__thumb-x {
    background-color: var(--v-primary-base);
    border-radius: 6px;
    transition: none;
    height: 14px;
    opacity: 1;
    /* there must be 'bottom' for ps__thumb-x */
    bottom: 1px;
    /* please don't change 'position' */
    position: absolute;
  }

  .ps__rail-x:hover > .ps__thumb-x,
  .ps__rail-x:focus > .ps__thumb-x,
  .ps__rail-x.ps--clicking .ps__thumb-x {
    background-color: var(--v-primary-base);
    opacity: 1;
    height: 14px;
  }
}
.btnLesson {
  z-index: 1 !important;
}
</style>
