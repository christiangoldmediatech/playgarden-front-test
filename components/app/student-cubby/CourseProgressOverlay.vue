<template>
  <v-overlay
    :class="`${loading ? 'align-center justify-center' : 'align-start justify-start'}`"
    :dark="false"
    :value="show"
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
            <v-row class="fill-height flex-nowrap">
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
                  v-bind="{ lesson, customOverrides: { lessonId: lesson.id, childId: studentId } }"
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
            />
            <blank-dashboard-panel
              v-else
              :letter="(lessons[0]) ? lessons[0].curriculumType.letter : ''"
              :day="selectedDay"
            >
              <template v-if="currentMobileLesson === -1">
                COME BACK TOMORROW TO UNLOCK THIS DAY
              </template>
              <template v-else>
                COME BACK LATER TO UNLOCK THIS DAY
              </template>
            </blank-dashboard-panel>
          </div>
          <v-carousel
            v-model="selectedDay"
            height="48px"
            width="100%"
            :hide-delimiter-background="true"
            :hide-delimiters="true"
          >
            <v-carousel-item v-for="i in 5" :key="`day-${i}`">
              <div class="d-flex align-center justify-center fill-height">
                <span class="font-weight-bold white--text">
                  Day {{ i }}
                </span>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-container>
      </template>
    </template>
  </v-overlay>
</template>

<script>
import DashboardPanel from '@/components/app/dashboard/DashboardPanel.vue'
import BlankDashboardPanel from '@/components/app/dashboard/BlankDashboardPanel.vue'
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CourseProgressOverlay',

  components: {
    DashboardPanel,
    BlankDashboardPanel,
    PerfectScrollbar
  },

  data: () => {
    return {
      show: false,
      selectedDay: 0,
      loading: false,
      lessons: []
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),

    studentId () {
      if (this.$route.name === 'app-student-cubby-course-progress') {
        return this.$route.query.id
      }
      if (this.currentChild && this.currentChild.length > 0) {
        return this.currentChild[0].id
      }
      return null
    },

    missing () {
      return 5 - this.lessons.length
    },

    currentMobileLesson () {
      const index = this.selectedDay
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
    }
  },

  mounted () {
    this.$nuxt.$on('show-curriculum-progress', (curriculumTypeId) => {
      if (this.studentId) {
        this.lessons = []
        this.loading = true
        this.getCourseProgressByChildId({ id: this.studentId, curriculumTypeId }).then((data) => {
          this.lessons = data.map(({ lesson }) => lesson)
          this.loading = false
        })
        this.show = true
        document.querySelector('html').style.overflowY = 'hidden'
      }
    })

    this.$nuxt.$on('close-curriculum-progress', (curriculumTypeId) => {
      if (this.show) {
        this.close()
        this.$nuxt.$emit('dashboard-panel-update')
      }
    })
  },

  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),

    close () {
      this.show = false
      this.selectedDay = 0
      document.querySelector('html').style.overflowY = 'auto'
    }
  }
}
</script>

<style lang="scss" scoped>
.top-left {
  position: fixed;
  top: 6px !important;
  left: 6px !important;
  z-index: 400;
}

.panel-column {
  max-width: 471px;
}
</style>

<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"></style>

<style lang="scss" scoped>
.panel-container {
  overflow-x: visible;
  @media screen and (max-width: 960px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
    padding-top: 32px;
    padding-bottom: 8px;
    z-index: 300;
    display: block;
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
    z-index: 300;
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
</style>
