<template>
  <div :class="{ 'watercolor-background': useBackground }">
    <!-- <v-container v-if="showScreen" fill-height>
      <v-row justify="center" align-sm="center" fill-height>
        <v-col cols="10" sm="6" md="5">
          <div class="dashboard-weekend-container">
            <div class="dashboard-weekend-content">
              <div class="dashboard-weekend-circle-1">
                <div class="dashboard-weekend-circle-2">
                  <img class="dashboard-weekend-img" src="@/assets/png/dashboard/weekendchild.png">
                </div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="7" xl="6">
          <div class="dashboard-weekend-title">
            <underlined-title
              font-size="30px"
              font-size-mobile="16px"
              font-weight="700"
              padding-bottom="0px"
              text="You finished school for the week, YAY!"
            />
          </div>
          <div class="dashboard-weekend-message">
            If you want more, go to the Activities Page and watch all your favorite teachers and Lessons all over again! See you back at school on Monday!
          </div>
          <v-row justify="center" justify-md="start">
            <v-col cols="9" md="5" lg="4">
              <v-btn color="accent" block @click="openCourseProgress">
                Rewatch letter A
              </v-btn>
            </v-col>
            <v-col cols="9" md="5" lg="4">
              <v-btn color="#FFAF4B" class="white--text" block nuxt :to="{ name: 'app-activities' }">
                Go to Activities
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container> -->
    <v-container
      :class="{
        'dashboard-container': !$vuetify.breakpoint.smAndDown && !previewMode,
        'dashboard-container-preview': !$vuetify.breakpoint.smAndDown && previewMode,
        'pg-mt-[80px]': !previewMode
      }"
      fluid
    >
      <v-row class="fill-height" justify="center">
        <v-col
          class="dashboard-column order-last order-md-first d-flex justify-center justify-md-start flex-shrink-1 flex-grow-0"
          cols="12"
          sm="8"
          md="5"
          lg="4"
          xl="3"
        >
          <dashboard-panel
            v-bind="{ lesson, childId, loading }"
            :next-button="canAdvance"
          />
        </v-col>

        <v-col
          class="dashboard-column d-flex flex-column flex-xl-shrink-0 flex-xl-grow-1"
          cols="12"
          sm="12"
          md="7"
          lg="8"
          xl="9"
        >
          <!-- Tutorial row -->
          <v-row
            class="dashboard-tip-row flex-grow-0 flex-shrink-1"
            justify="center"
            justify-md="start"
            align="center"
            :no-gutters="$vuetify.breakpoint.smAndUp"
          >
            <v-col cols="12" md="3" sm="6">
              <v-row>
                <child-select
                  class="mx-3"
                  :value="value"
                  :preview-mode="previewMode"
                  hide-details
                  :management-button="!previewMode"
                  @input="$emit('input', $event)"
                />
              </v-row>
            </v-col>
            <!--carousel letter-->
            <v-col cols="12" md="9" sm="6">
              <v-row
                class="mx-md-2 my-md-0 mx-sm-4 my-sm-2 mx-xs-4 my-xs-2"
                justify="center"
              >
                <carousel-letter
                  ref="CarouselLetter"
                  :value="curriculumTypeId"
                  :preview-mode="previewMode"
                />
              </v-row>
            </v-col>
            <!--carousel letter-->
          </v-row>

          <v-row
            :class="[
              'dashboard-content',
              {
                'dashboard-mobile-content': $vuetify.breakpoint.sm
                // 'dashboard-xs-content': $vuetify.breakpoint.xsOnly
              }
            ]"
            no-gutters
          >
            <v-col class="dashboard-content-column" cols="12">
              <template v-if="$route.name === 'app-dashboard' || loading">
                <div
                  v-if="
                    $route.name === 'app-dashboard-lesson-videos' ||
                      $route.name === 'app-dashboard-lesson-activities'
                  "
                  class="video-lesson"
                >
                  <v-card class="video-skeleton" width="100%">
                    <v-skeleton-loader type="image, image, table-heading" />
                  </v-card>
                </div>
                <div
                  v-if="$route.name === 'app-dashboard-online-worksheet'"
                  class="video-lesson"
                >
                  <v-card class="video-skeleton" width="100%">
                    <v-skeleton-loader class="pt-6" type="article" />
                    <v-row class="mt-4">
                      <v-col v-for="n in 4" :key="n">
                        <v-skeleton-loader type="card" />
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
                <div v-if="$route.name === 'app-dashboard-offline-worksheet'">
                  <v-skeleton-loader type="image, image, article" />
                </div>
              </template>
              <template v-else>
                <slot />
              </template>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <lesson-teacher-video />
    <course-progress-overlay />
    <puzzle-pieces-dialog />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { APP_EVENTS, TAG_MANAGER_EVENTS } from '@/models'

import DashboardPanel from '@/components/app/dashboard/DashboardPanel.vue'
import LessonTeacherVideo from '@/components/app/dashboard/LessonTeacherVideo.vue'
import PuzzlePiecesDialog from '@/components/app/student-cubby/PuzzlePiecesDialog.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import CourseProgressOverlay from '@/components/app/student-cubby/CourseProgressOverlay.vue'
import CarouselLetter from '@/components/app/all-done/CarouselLetter.vue'
import DashboardOverrides from '@/mixins/DashboardOverridesMixin'

export default {
  name: 'DashboardLayout',

  components: {
    DashboardPanel,
    LessonTeacherVideo,
    PuzzlePiecesDialog,
    ChildSelect,
    CourseProgressOverlay,
    CarouselLetter
  },

  mixins: [DashboardOverrides],

  props: {
    value: {
      type: [Array, Number, Object, String],
      required: true
    },

    lesson: {
      validator: (val) => {
        return typeof val === 'object' || val === null
      },
      default: null
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    previewMode: {
      type: Boolean,
      required: false,
      default: false
    },

    childId: {
      type: [Array, Number, Object, String],
      required: false,
      default: null
    }
  },

  computed: {
    ...mapGetters('auth', ['getUserInfo']),
    useBackground() {
      return this.$route.name === 'app-dashboard-lesson-videos' ||
        this.$route.name === 'app-dashboard-online-worksheet' ||
        this.$route.name === 'app-dashboard-offline-worksheet' ||
        this.$route.name === 'app-dashboard-lesson-activities' ||
        this.$route.name === 'app-dashboard-lesson-completed' ||
        this.$route.name === 'app-dashboard'
    },

    overrideMode() {
      if (this.overrides.childId && this.overrides.lessonId) {
        return true
      }
      return false
    },
    // showScreen () {
    //   const today = new Date().getTime()
    //   const monday = Date.parse('2020-12-21T08:00:00.000-05:00')
    //   return !this.overrideMode && (this.lesson && this.lesson.curriculumType.id > 1) && (today < monday)
    // }
    canAdvance() {
      if (this.lesson && this.lesson.curriculumType.name === 'Intro') {
        return true
      }

      if (this.lesson && this.childId && !this.previewMode) {
        // completed all video lessons
        const areLessonVideosCompleted = this.lesson?.videos?.every(video =>
          Boolean(video?.viewed?.completed)
        )

        // completed all online worksheets
        const areOnlineWorksheetsCompleted = this.lesson?.worksheets
          ?.filter(worksheet => worksheet.type === 'ONLINE')
          ?.every(worksheet => Boolean(worksheet?.completed?.completed))

        // completed all lesson activities
        const areLessonActivitiesCompleted = this.lesson?.lessonsActivities?.every(
          activity => Boolean(activity?.activity?.viewed?.completed)
        )

        return (
          areLessonVideosCompleted &&
          areOnlineWorksheetsCompleted &&
          areLessonActivitiesCompleted
        )
      }

      return false
    },

    curriculumTypeId() {
      if (this.lesson && this.lesson.curriculumType) {
        return this.lesson.curriculumType.id
      } else {
        return null
      }
    }
  },

  watch: {
    value() {
      this.$refs.CarouselLetter.fetchChildProgress()
    },

    lesson() {
      this.$refs.CarouselLetter.fetchChildProgress()
    }
  },

  created() {
    this.$nuxt.$on(APP_EVENTS.DASHBOARD_VIDEO_LESSON_VIDEO_CLICKED, (videoId) => {
      const lessonData = this.lesson.videos.find(video => video.id === videoId)
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_VIDEO_LESSON_VIDEO_CLICKED,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day,
        topic: lessonData.activityType.name,
        topicDescription: lessonData.description
      })
    })
    this.$nuxt.$on(APP_EVENTS.DASHBOARD_ACTIVITY_VIDEO_CLICKED, (activityId) => {
      const activityData = this.lesson.lessonsActivities.find(
        activity => activity.activity.id === activityId
      )
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_ACTIVITY_VIDEO_CLICKED,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day,
        topic: activityData.activity.activityType.name,
        topicDescription: activityData.activity.videos.description
      })
    })
  },

  beforeDestroy() {
    this.$nuxt.$off(APP_EVENTS.DASHBOARD_VIDEO_LESSON_VIDEO_CLICKED)
    this.$nuxt.$off(APP_EVENTS.DASHBOARD_ACTIVITY_VIDEO_CLICKED)
  },

  methods: {
    openCourseProgress() {
      this.$nuxt.$emit('show-curriculum-progress', 1)
    }
  }
}
</script>

<style lang="scss">
.watercolor-background {
  background-image: url("~@/assets/png/play-learn/acuarela-green.png"),
    url("~@/assets/png/play-learn/acuarela-yellow.png"),
    url("~@/assets/png/play-learn/acuarela-yellow.png"),
    url("~@/assets/png/play-learn/acuarela-yellow.png");
  background-size: auto,
    400px 400px,
    400px 400px,
    400px 400px;
  background-position: 20% 0%,
    100% -15%,
    -10% 100%,
    25% 90%;
}

.dashboard {
  &-container {
    @media screen and (min-width: 1025px) {
      height: calc(100vh);
      max-height: calc(100vh);
    }
  }
  &-container-preview {
    height: calc(100vh - 80px);
    max-height: calc(100vh - 80px);
  }
  &-column {
    height: 100%;
    max-height: 100%;
  }
  &-child-pick-container {
    width: 225px;
  }
  &-content {
    height: 100%;

    @media screen and (min-width: 960px) {
      height: calc(100% - 70px);
    }

    &-column {
      max-height: 100%;
    }
    &-card {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    }
    &-scroll {
      overflow-y: auto;
    }
  }
  &-tip-row {
    min-height: 70px;
  }
  &-mobile-content {
    min-height: calc(100vh - 162px);
  }
  &-xs-content {
    min-height: calc(100vh - 256px);
  }
  &-video-thumbnail {
    background-image: var(--videoThumbnailUrl);
    background-position: center, center;
    background-repeat: no-repeat, no-repeat;
    background-size: cover;
  }
  &-weekend {
    &-container {
      width: 100%;
      height: 0px;
      max-width: 634px;
      padding-top: 100%;
      position: relative;
      margin: 0 auto;
    }
    &-content {
      width: 100%;
      max-height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    &-circle-1 {
      width: 100%;
      height: 100%;
      padding: 7%;
      border-radius: 50%;
      background: #68c453;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.184314);
    }
    &-circle-2 {
      width: 100%;
      height: 100%;
      padding: 7%;
      border-radius: 50%;
      background: #b2e68d;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.184314);
    }
    &-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: center;
    }
    &-title {
      line-height: 1.5;
      text-align: center;
      margin-bottom: 16px;
      @media screen and (min-width: 960px) {
        text-align: left;
      }
    }
    &-message {
      font-weight: 500;
      font-size: 14px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 16px;
      @media screen and (min-width: 960px) {
        text-align: left;
        font-size: 20px;
      }
      @media screen and (min-width: 1264px) {
        font-size: 24px;
      }
    }
  }
}

.video-skeleton {
  height: 100% !important;
}
</style>
