<template>
  <div class="lesson-panel-container">
    <v-card
      class="lesson-panel-card mt-0 mt-sm-16 mt-md-0"
      elevation="0"
      height="100%"
      :color="backgroundColor"
    >
      <div
        class="lesson-panel-card-border-top"
        :class="{ 'lesson-panel-card-border-top-light': useLightTheme }"
      >
        <slot name="panel-toolbar">
          <!-- HORIZONTAL LESSON NAVIGATION BAR -->
          <v-row
            v-if="!displayMode"
            class="my-0"
            justify="space-between"
            align="center"
            fill-height
          >
            <v-col class="btnLesson">
              <v-tooltip
                v-if="(previousLessonId && !$vuetify.breakpoint.smAndDown) && !blockPreviousBtn"
                top
                class="pb-6"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="ml-3"
                    icon
                    v-bind="attrs"
                    :retain-focus-on-click="false"
                    v-on="on"
                    @click.stop="previousLesson"
                    @blur="on.blur"
                  >
                    <img
                      :src="
                        useLightTheme
                          ? require('@/assets/svg/back-arrow-green.svg')
                          : require('@/assets/svg/back-arrow.svg')
                      "
                    />
                  </v-btn>
                </template>
                <span>{{ $t('dailyLessons.panel.previousDay') }}</span>
              </v-tooltip>
              <template v-else>
                <v-btn
                  v-if="previousLessonId && !blockPreviousBtn"
                  class="ml-3"
                  icon
                  @click.stop="previousLesson"
                >
                  <img
                    :src="
                      useLightTheme
                        ? require('@/assets/svg/back-arrow-green.svg')
                        : require('@/assets/svg/back-arrow.svg')
                    "
                  />
                </v-btn>
              </template>
            </v-col>
            <v-spacer />
            <v-col class="btnLesson">
              <p class="text-right my-0 mr-3">
                <v-tooltip
                  v-if="!$vuetify.breakpoint.smAndDown"
                  top
                  :open-on-focus="true"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="ml-3"
                      icon
                      :class="{
                        'pg-opacity-50': !nextButton
                      }"
                      :disabled="!nextButton"
                      :retain-focus-on-click="false"
                      v-bind="attrs"
                      v-on="on"
                      @click.stop="advance"
                      @blur="on.blur"
                    >
                      <img
                        :src="
                          useLightTheme
                            ? require('@/assets/svg/next-arrow-green.svg')
                            : require('@/assets/svg/next-arrow.svg')
                        "
                      />
                    </v-btn>
                  </template>
                  <span>{{ $t('dailyLessons.panel.nextDay') }}</span>
                </v-tooltip>
                <template v-else>
                  <v-btn
                    icon
                    :class="{
                      'pg-opacity-50': !nextButton
                    }"
                    :disabled="!nextButton"
                    @click.stop="advance"
                  >
                    <img
                      :src="
                        useLightTheme
                          ? require('@/assets/svg/next-arrow-green.svg')
                          : require('@/assets/svg/next-arrow.svg')
                      "
                    />
                  </v-btn>
                </template>
              </p>
            </v-col>
          </v-row>
        </slot>
      </div>

      <!-- BIG CIRCLE WITH CURRENT LETTER -->
      <pg-circle-letter-day
        :class="{ clickable: !displayMode }"
        :day="lesson ? lesson.day : null"
        :letter="lesson ? lesson.curriculumType.letter : null"
        :light-theme="useLightTheme"
        :active="lesson.doing"
        @click.native="openCourseProgress"
      />

      <div v-if="lesson" class="lesson-panel-content">
        <v-btn
          large
          color="accent text-wrap dynamic-width"
          class="mb-5"
          @click.stop="downloadWorksheetsAllLesson()"
          :disabled="loadingDownloadLessonsFile"
        >
          <v-avatar size="40" color="accent ml-n4">
            <v-icon size="25" color="white">
              mdi-download
            </v-icon>
          </v-avatar>
          <p
            id="lesson-weekly-letter-worksheets"
            class="pr-6 text-wrap dynamic-width ma-0"
            :class="{
              'title-download-mobile': $vuetify.breakpoint.mobile
            }"
          >
            {{ $t('dailyLessons.panel.downloadWorksheets', {letter: getLetter}) }}
          </p>
        </v-btn>
        <!-- VIDEO LESSONS -->
        <content-section
          titleId="lesson-video-lessons"
          number="1"
          :title="$t('dailyLessons.panel.videoTitle')"
          :progress="videos.progress"
          :progress-next="videos.progressNext"
          enabled
        >
          <!-- VIDEOS -->
          <content-list
            :items="videos.items"
            v-bind="{ noLinkMode }"
            item-type="videoLesson"
          />

          <!-- PROGRESS -->
          <lesson-progress id="win-a-puzzle-piece" :progress="videos.progress" />
        </content-section>

        <!-- WORKSHEETS -->
        <content-section
          number="2"
          :title="$t('dailyLessons.panel.worksheetTitle')"
          :progress="worksheets.progress"
          :progress-next="worksheets.progressNext"
          :enabled="videos.progress === 100"
        >
          <!-- ONLINE WORKSHEETS -->
          <!-- Tablet and up || Mobile portrait -->
          <template
            v-if="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          >
            <lesson-online-worksheet
              v-for="(onlineWorksheet,
              onlineWorksheetIndex) in worksheets.ONLINE"
              :key="onlineWorksheet.id"
              :is-admin="isAdmin"
              :online-worksheet="onlineWorksheet"
              :progress="lesson.curriculumType.letter === 'In' ? 100 : videos.progress"
              :no-link-mode="noLinkMode"
              :to="
                noLinkMode
                  ? undefined
                  : generateNuxtRoute('online-worksheet', {
                      worksheet: onlineWorksheetIndex
                    })
              "
              :enabled="lesson.curriculumType.letter === 'In' || completedOnlineWorksheets >= onlineWorksheetIndex"
              :active="worksheetQuery === onlineWorksheetIndex"
            />
          </template>

          <!-- Mobile landscape -->
          <template v-if="$vuetify.breakpoint.smOnly">
            <v-col cols="12" class="pa-0 dailyLessonsScrolView">
              <lesson-online-worksheet
                v-for="(onlineWorksheet,
                onlineWorksheetIndex) in worksheets.ONLINE"
                :key="onlineWorksheet.id"
                :is-admin="isAdmin"
                :online-worksheet="onlineWorksheet"
                :progress="lesson.curriculumType.letter === 'In' ? 100 : videos.progress"
                :no-link-mode="noLinkMode"
                :to="
                  noLinkMode
                    ? undefined
                    : generateNuxtRoute('online-worksheet', {
                        worksheet: onlineWorksheetIndex
                      })
                "
                :enabled="lesson.curriculumType.letter === 'In' || completedOnlineWorksheets >= onlineWorksheetIndex"
                :active="worksheetQuery === onlineWorksheetIndex"
              />
            </v-col>
          </template>

          <!-- OFFLINE WORKSHEETS -->
          <!-- Tablet and up || Mobile portrait -->
          <template
            v-if="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          >
            <!-- DOWNLOAD WORKSHEETS-->
            <v-card
              :disabled="false"
              :ripple="false"
              class="dashboard-item pass-through"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              @click.stop="handleDownloadWorksheetClick"
            >
              <v-row no-gutters align="center">
                <v-col v-if="offlineWorksheet" cols="4">
                  <v-img
                    class="dashboard-item-image"
                    :src="
                      offlineWorksheet.pdfThumbnail ||
                        require('@/assets/png/pdf-thumbnail-placeholder.png')
                    "
                    :position="
                      offlineWorksheet.pdfThumbnail
                        ? 'center center'
                        : 'center 77%'
                    "
                    cover
                    height="100px"
                  />
                </v-col>

                <v-col cols="8">
                  <div class="mx-2 mt-4 mb-2">
                    <span :class="['dashboard-item-activity-type']">
                      {{ $t('dailyLessons.downloadWorksheetDay') }}
                    </span>
                  </div>
                  <div
                    class="d-flex flex-nowrap pa-2 mt-n4 align-center text-body-2"
                  >
                    <div
                      class="worksheet-title flex-grow-1 pr-2 dashboard-item-disabled"
                    >
                      {{ $t('dailyLessons.worksheet') }}
                    </div>

                    <div>
                      <v-img
                        height="40px"
                        contain
                        :src="
                          require('@/assets/png/dashboard/download-ico.png')
                        "
                      />
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <!-- WORKSHEET VIDEO -->
            <v-card
              v-if="!displayMode && worksheets.OFFLINE && worksheets.OFFLINE.videoDetail"
              :disabled="lesson.curriculumType.letter === 'In' ? false : videos.progress < 100 || noLinkMode"
              :to="generateNuxtRoute('offline-worksheet')"
              :ripple="false"
              class="dashboard-item"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              nuxt
              exact
              @click="handleWorksheetVideos"
            >
              <v-row no-gutters>
                <v-col
                  cols="4"
                  align-self="center"
                  class="d-flex justify-center"
                >
                  <v-img
                    cover
                    height="100px"
                    class="dashboard-item-image"
                    :src="
                      require('@/assets/png/dashboard/offline-worksheet-video.png')
                    "
                  />
                </v-col>

                <v-col cols="8" align-self="center" class="pa-2">
                  <div
                    class="text-uppercase dashboard-item-title"
                    :class="{
                      'dashboard-item-disabled': lesson.curriculumType.letter === 'In' ? false : videos.progress < 100
                    }"
                  >
                    {{ worksheets.OFFLINE.name }}
                  </div>

                  <div class="text-caption grey--text">
                    {{ worksheets.OFFLINE.description }}
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <!-- UPLOAD WORKSHEETS -->
            <v-card
              v-if="!displayMode"
              :disabled="lesson.curriculumType.letter === 'In' ? false : videos.progress < 100"
              :ripple="false"
              class="dashboard-item"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              @click.stop="uploadDialog = true"
            >
              <v-row no-gutters class="py-2">
                <v-col
                  cols="3"
                  align-self="center"
                  class="d-flex justify-center"
                >
                  <v-img
                    height="40px"
                    contain
                    :src="
                      require('@/assets/png/dashboard/upload-worksheet.png')
                    "
                  />
                </v-col>

                <v-col cols="9" align-self="center">
                  <div
                    id="upload-worksheets-button"
                    class="text-uppercase dashboard-item-title"
                    :class="{
                      'dashboard-item-disabled': lesson.curriculumType.letter === 'In' ? false : videos.progress < 100
                    }"
                  >
                    {{ $t('dailyLessons.panel.uploadWorksheet') }}
                  </div>

                  <div class="text-caption grey--text">
                    {{ $t('dailyLessons.panel.uploadWorksheetSubtitle') }}
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </template>

          <!-- Mobile landscape -->
          <template v-if="$vuetify.breakpoint.smOnly">
            <div class="dailyLessonsScrolView">
              <!-- WORKSHEET VIDEO -->
              <v-col cols="4" class="pa-0">
                <v-card
                  v-if="!displayMode && worksheets.OFFLINE"
                  :disabled="lesson.curriculumType.letter === 'In' ? false : videos.progress < 100 || noLinkMode"
                  :to="generateNuxtRoute('offline-worksheet')"
                  :ripple="false"
                  class="dashboard-item"
                  active-class="dashboard-item-active"
                  exact-active-class="dashboard-item-exact"
                  nuxt
                  exact
                  @click="handleWorksheetVideos"
                >
                  <v-row no-gutters>
                    <v-img
                      cover
                      height="100px"
                      class="dashboard-item-image"
                      :src="
                        require('@/assets/png/dashboard/offline-worksheet-video.png')
                      "
                    />

                    <div class="mx-2 mt-4 mb-2">
                      <div
                        class="text-uppercase dashboard-item-title"
                        :class="{
                          'dashboard-item-disabled': lesson.curriculumType.letter === 'In' ? false : videos.progress < 100
                        }"
                      >
                        {{ worksheets.OFFLINE.name }}
                      </div>

                      <div class="text-caption grey--text">
                        {{ worksheets.OFFLINE.description }}
                      </div>
                    </div>
                  </v-row>
                </v-card>
              </v-col>

              <!-- DOWNLOAD WORKSHEETS -->
              <v-col cols="4" class="pa-0">
                <v-card
                  :disabled="noLinkMode"
                  :ripple="false"
                  class="dashboard-item pass-through d-flex align-center justify-center"
                  active-class="dashboard-item-active"
                  exact-active-class="dashboard-item-exact"
                  height="85%"
                  @click.stop="handleDownloadWorksheetClick"
                >
                  <v-row no-gutters class="py-2">
                    <v-img
                      height="70px"
                      class="mb-3"
                      contain
                      :src="require('@/assets/png/dashboard/download-ico.png')"
                    />

                    <div
                      class="text-uppercase dashboard-item-title text-center"
                    >
                      {{ $t('dailyLessons.panel.downloadWorksheet') }}
                    </div>

                    <span
                      v-if="isAdmin && childId"
                      class="clickable admin-view-worksheets"
                      @click.stop="goToAdminWorksheets"
                    >
                      {{ $t('dailyLessons.panel.viewWorksheets') }}
                    </span>
                  </v-row>
                </v-card>
              </v-col>

              <!-- UPLOAD WORKSHEETS -->
              <v-col cols="4" class="pa-0">
                <v-card
                  v-if="!displayMode"
                  :disabled="videos.progress < 100"
                  :ripple="false"
                  class="dashboard-item d-flex align-center justify-center"
                  active-class="dashboard-item-active"
                  exact-active-class="dashboard-item-exact"
                  height="85%"
                  @click.stop="uploadDialog = true"
                >
                  <v-row no-gutters class="py-2">
                    <v-img
                      height="70px"
                      contain
                      class="mb-3"
                      :src="
                        require('@/assets/png/dashboard/upload-worksheet.png')
                      "
                    />

                    <div
                      id="upload-worksheets-button"
                      class="text-uppercase dashboard-item-title text-center"
                      :class="{
                        'dashboard-item-disabled': videos.progress < 100
                      }"
                    >
                      {{ $t('dailyLessons.panel.uploadWorksheet') }}
                    </div>
                  </v-row>
                </v-card>
              </v-col>
            </div>
          </template>

          <!-- PROGRESS -->
          <lesson-progress
            :progress="worksheets.progress"
            :total-completed-worksheets="worksheets.totalCompletedWorksheets"
            :total-worksheets="worksheets.totalWorksheets"
          />
        </content-section>

        <content-section
          v-if="activities && activities.items.length > 0"
          id="lesson-activities"
          number="3"
          :title="$t('dailyLessons.panel.activitiesTitle')"
          :progress="activities.progress"
          :progress-next="activities.progressNext"
          :enabled="videos.progress === 100"
        >
          <content-list
            :items="activities.items"
            v-bind="{ noLinkMode }"
            item-type="activity"
          />

          <!-- PROGRESS -->
          <lesson-progress :progress="activities.progress" />
        </content-section>
      </div>
    </v-card>

    <upload-offline-worksheet-dialog
      v-if="uploadDialog"
      v-model="uploadDialog"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DashboardMixin from '@/mixins/DashboardMixin'
import LessonAdvanceMixin from '@/mixins/LessonAdvanceMixin'
import { defineComponent, useStore } from '@nuxtjs/composition-api'

import { APP_EVENTS, TAG_MANAGER_EVENTS } from '@/models'

import UploadOfflineWorksheetDialog from './worksheets/UploadOfflineWorksheetDialog'
import ContentSection from './ContentSection.vue'
import ContentList from './ContentList.vue'
import LessonProgress from './LessonProgress.vue'
import LessonOnlineWorksheet from './LessonOnlineWorksheet.vue'
import { useOfflineWorksheet } from '@/composables'

export default defineComponent({
  name: 'DashboardPanel',

  components: {
    UploadOfflineWorksheetDialog,
    ContentSection,
    ContentList,
    LessonProgress,
    LessonOnlineWorksheet
  },

  mixins: [DashboardMixin, LessonAdvanceMixin],

  props: {
    lesson: {
      required: false,
      validator: (val) => {
        return val === null || typeof val === 'object'
      },
      default: null
    },

    displayMode: {
      type: Boolean,
      required: false,
      default: false
    },

    noLinkMode: {
      type: Boolean,
      required: false,
      default: false
    },

    customOverrides: {
      type: Object,
      required: false,
      default: () => {}
    },

    nextButton: {
      type: Boolean,
      required: false,
      default: false
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    backgroundColor: {
      type: String,
      default: 'transparent'
    },

    childId: {
      type: [Array, Number, Object, String],
      required: false,
      default: null
    },

  },

  data: () => {
    return {
      uploadDialog: false,
      dataLessons: null,
      loadingDownloadLessonsFile: false
    }
  },

  setup() {
    const store = useStore ()
    const {
      getUploaded,
      getFileUpload,
      mergeFilesOfflineLesson
    } = useOfflineWorksheet({ store })

    return {
      getUploaded,
      getFileUpload,
      mergeFilesOfflineLesson
    }
  },

  watch: {
    lesson(val) {
      if (val) {
        this.getLessonsList()
      }
    }
  },

  computed: {
    ...mapGetters('auth', ['getUserInfo']),
    ...mapGetters('children/lesson', {
      previousLessonId: 'getPreviousLessonId'
    }),

    getLetter () {
      return (this.lesson && this.lesson.curriculumType && this.lesson.curriculumType.letter) ? (this.lesson.curriculumType.id !== 28)? this.lesson.curriculumType.letter[0] : this.lesson.curriculumType.letter : ''
    },

    getSelectedLetterId() {
      return (this.lesson && this.lesson.curriculumType && this.lesson.curriculumType) ? this.lesson.curriculumType.id : ''
     },

    blockPreviousBtn() {
      return this.lesson.day === 1 && this.lesson.curriculumType.letter === 'In'
    },

    useLightTheme() {
      return (
        this.$route.name === 'app-dashboard-lesson-videos' ||
        this.$route.name === 'app-dashboard-online-worksheet' ||
        this.$route.name === 'app-dashboard-offline-worksheet' ||
        this.$route.name === 'app-dashboard-lesson-activities' ||
        this.$route.name === 'app-dashboard-lesson-completed' ||
        this.$route.name === 'app-dashboard'
      )
    },

    offlineWorksheet() {
      if (this.lesson) {
        return this.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
      }
      return null
    },

    completedOnlineWorksheets() {
      let completed = 0
      this.worksheets.ONLINE.forEach((worksheet) => {
        if (worksheet.completed) {
          completed++
        }
      })
      return completed
    },

    worksheetQuery() {
      const q = this.$route.query.worksheet

      if (Number(q) >= 0) {
        return Number(q)
      }

      if (this.$route.name.includes('online-worksheet')) {
        return 0
      }

      return undefined
    },

    isAdmin() {
      return this.$route.name.includes('admin')
    }
  },

  created  () {
    this.$nuxt.$on(APP_EVENTS.DASHBOARD_VIDEO_LESSON_CLICKED, (topicData) => {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_VIDEO_LESSON_CLICKED,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day,
        topic: topicData.type,
        topicDescription: topicData.description
      })
    })
    this.$nuxt.$on(APP_EVENTS.DASHBOARD_ACTIVITY_CLICKED, (topicData) => {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_ACTIVITY_CLICKED,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day,
        topic: topicData.type,
        topicDescription: topicData.description
      })
    })
    this.$nuxt.$on(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_COMPLETED, () => {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_ONLINE_WORKSHEET_COMPLETED,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day
      })
    })
    this.$nuxt.$on(APP_EVENTS.DASHBOARD_WORKSHEET_DOWNLOAD, (fileName) => {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_WORKSHEET_DOWNLOAD,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day,
        fileName
      })
    })
    this.$nuxt.$on(APP_EVENTS.DASHBOARD_WORKSHEET_UPLOAD, (category) => {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_WORKSHEET_UPLOAD,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day,
        topic: category
      })
    })
    this.getLessonsList()
  },

  beforeDestroy() {
    this.$nuxt.$off(APP_EVENTS.DASHBOARD_VIDEO_LESSON_CLICKED)
    this.$nuxt.$off(APP_EVENTS.DASHBOARD_ACTIVITY_CLICKED)
    this.$nuxt.$off(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_COMPLETED)
    this.$nuxt.$off(APP_EVENTS.DASHBOARD_WORKSHEET_DOWNLOAD)
    this.$nuxt.$off(APP_EVENTS.DASHBOARD_WORKSHEET_UPLOAD)
  },

  methods: {
    ...mapActions('children/lesson', ['getLessonsByLetterId']),
    goToAdminWorksheets() {
      const routerData = this.$router.resolve({
        name: 'admin-portfolio',
        query: {
          id: this.childId
        }
      })

      window.open(routerData.href, '_blank')
    },

    async getLessonsList() {
      this.dataLessons = await this.getLessonsByLetterId({ curriculumTypeId: this.getSelectedLetterId, page: 1, limit: 10})
    },

    async downloadWorksheetsAllLesson() {
      this.loadingDownloadLessonsFile = true
      const { path } = await this.getFileUpload({
        type: 'upload-document',
        folder: 'lesson',
        filename: `merge-worksheets-letter-${this.getSelectedLetterId}.pdf`
      })

      if (path) {
        window.open(path, '_blank')
      } else {
        let worksheetsOffline = new Array()
        this.dataLessons.map((e) => {
          e.worksheets.find((w) => {
            if (w.type === 'OFFLINE') worksheetsOffline.push(w.pdfUrl)
          })
        })

        const { filePath } = await this.mergeFilesOfflineLesson({
          files: worksheetsOffline,
          folder: 'lesson',
          filename: `merge-worksheets-letter-${this.selectedLetter}.pdf`
        })
        window.open(filePath, '_blank')
      }
      this.loadingDownloadLessonsFile = false
    },

    openPdf() {
      if (this.offlineWorksheet) {
        window.open(this.offlineWorksheet.pdfUrl, '_blank')
        this.$gtm.push({
          event: TAG_MANAGER_EVENTS.DASHBOARD_WORKSHEET_DOWNLOAD,
          user_id: this.getUserInfo.id,
          day_letter: this.lesson.curriculumType.letter,
          day_number: this.lesson.day,
          file_name: this.offlineWorksheet.name,
          link_url: this.offlineWorksheet.pdfUrl,
          file_extension: 'pdf'
        })
      }
    },

    openCourseProgress() {
      if (!this.displayMode) {
        this.$nuxt.$emit(
          'show-curriculum-progress',
          this.lesson.curriculumType.id
        )
      }else if (this.lesson.doing) {
        this.$router.push({
          name: 'app-dashboard-lesson-videos',
          query: {
            childId: this.childId,
            lessonId: this.lesson.id,
            id: this.lesson.videos[0].id
          }
        })
      }
    },

    handleOnlineWorksheetClick() {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day
      })
    },

    handleWorksheetVideos() {
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.DASHBOARD_WORKSHEET_VIDEOS_CLICKED,
        userId: this.getUserInfo.id,
        dayLetter: this.lesson.curriculumType.letter,
        dayNumber: this.lesson.day
      })
    },

    handleDownloadWorksheetClick() {
      if (!this.noLinkMode) {
        this.openPdf()
        this.$router.push({ name: 'app-dashboard-offline-worksheet' })
      }
    }
  }
})
</script>

<style lang="scss">
.dashboard {
  &-item {
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15) !important;
    border-radius: 8px !important;
    margin: 16px 12px;
    background: white;

    &-image {
      border-radius: 8px;
      filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));
    }

    // do not show vuetify's selected item shade
    &.v-list-item--link:before {
      content: none;
    }

    &-title {
      font-size: 16px !important;
      font-weight: bold !important;
      letter-spacing: 0.1em !important;
      color: var(--v-black-base);
    }

    &-disabled {
      color: rgba(0, 0, 0, 0.38) !important;
    }

    &-exact,
    &-active {
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
      margin: 12px 8px;
      border: 4px solid #ffab37 !important;
      border-radius: 12px !important;
    }
  }
}
.title-download-mobile {
  font-size: 12px !important;
}
.lesson-panel {
  &-container {
    height: 100%;
    padding-top: 70px;
    min-width: 100%;
    max-width: 501px;
    margin: 0 auto;
    display: block;
    @media screen and (max-width: 500px) {
      max-width: calc(100vw - 24px);
    }
  }

  &-card {
    padding-top: 87px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    &-border-top {
      width: 100%;
      height: 58px;
      position: absolute;
      top: 0;
      background-color: #b2e68d;
      border-radius: 5px;
    }
  }

  &-card-border-top-light {
    background-color: white;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.290196);
  }

  &-content {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    padding: 12px;

    &-extra-padding {
      @media screen and (max-width: 959px) {
        padding-bottom: 97px !important;
      }
      @media screen and (min-width: 960px) {
        height: calc(100% - 97px);
        max-height: calc(100% - 97px);
      }
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  &-worksheet {
    &-text {
      font-size: 16px !important;
      font-weight: bold !important;
      letter-spacing: 0.1em !important;
    }
    &-btn {
      height: 36px;
    }
  }

  &-disabled {
    -webkit-filter: opacity(40%); /* Chrome, Safari, Opera */
    filter: opacity(40%);
  }

  &-next {
    width: 100%;
    height: 63px;
    background-color: var(--v-accent-base);
    font-size: 18px;
    font-weight: 700;
    color: white;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    @media screen and (min-width: 600px) {
      font-size: 22px;
    }
    &-arrow {
      margin-left: 8px;
      width: 27px;
      height: 22px;
      vertical-align: middle;
    }
    &-disabled {
      background-color: #bbbbbb;
      cursor: wait;
    }
  }
}
</style>

<style lang="scss" scoped>
.dailyLessonsScrolView {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .v-card {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 50%;
  }
}
@media screen and(min-width:960px) {
  .dailyLessonsScrolView {
    display: block;
  }
}
#download-worksheet-btn.v-btn--disabled,
#download-worksheet-btn.v-btn--disabled i.v-icon,
#upload-worksheet-btn.v-btn--disabled,
#upload-worksheet-btn.v-btn--disabled i.v-icon {
  color: white !important;
  font-size: 12px !important;
  font-weight: bold !important;
  letter-spacing: 0.04em !important;
  @media screen and (min-width: 350px) {
    font-size: 15px !important;
  }
  @media screen and (min-width: 600px) {
    font-size: 18px !important;
  }
}

.v-tooltip__content {
  background-color: var(--v-accent-base) !important;
  color: white !important;
  font-weight: bold !important;
  border-radius: 6px !important;
  z-index: 2 !important;
}

.v-tooltip__content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 35%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--v-accent-base) transparent transparent transparent;
}

.btnLesson {
  z-index: 1 !important;
}

span.admin-view-worksheets {
  font-size: 12px;
  text-decoration: underline !important;
  color: var(--v-accent-base) !important;
}

.pass-through {
  pointer-events: auto !important;
}

.dynamic-width {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%; /* Adjust this value based on your needs */
}
</style>
