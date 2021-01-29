<template>
  <div class="dashboard-panel-container">
    <v-card class="dashboard-panel-card" height="100%">
      <div class="dashboard-panel-card-border-top" />

      <pg-circle-letter-day
        :class="{ 'clickable': !displayMode }"
        :day="lesson ? lesson.day : null"
        :letter="lesson ? lesson.curriculumType.letter : null"
        @click.native="openCourseProgress"
      />

      <div class="dashboard-panel-content pa-3" :class="{ 'dashboard-panel-content-extra-padding': nextButton }">
        <content-section
          number="1"
          title="Video Lessons"
          :progress="videos.progress"
          :progress-next="videos.progressNext"
          enabled
        >
          <content-list :items="videos.items" v-bind="{ noLinkMode }" />
        </content-section>

        <content-section
          number="2"
          title="Worksheets"
          :progress="worksheets.progress"
          :progress-next="worksheets.progressNext"
          :enabled="videos.progress === 100"
        >
          <template v-slot:title-append>
            <v-img
              :class="['ml-2', { 'dashboard-panel-disabled': videos.progress < 100 }]"
              :src="require('@/assets/png/dashboard/worksheets.png')"
              max-width="32px"
              max-height="32px"
              contain
            />
          </template>
          <v-list class="py-0" dense>
            <v-list-item
              v-if="worksheets.ONLINE.length"
              class="dashboard-item"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              :disabled="videos.progress < 100"
              :nuxt="!noLinkMode"
              :exact="!noLinkMode"
              :to="noLinkMode ? undefined : generateNuxtRoute('online-worksheet')"
            >
              <v-list-item-content>
                <v-list-item-title :class="['dashboard-panel-worksheet-text', { 'dashboard-item-disabled': videos.progress < 100 }]">
                  ONLINE WORKSHEET
                </v-list-item-title>
                <v-list-item-subtitle v-if="noLinkMode">
                  Completed: {{ completedOnlineWorksheets }}/{{ worksheets.ONLINE.length }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-if="worksheets.OFFLINE"
              class="dashboard-item"
              active-class="dashboard-item-active"
              exact-active-class="dashboard-item-exact"
              :disabled="videos.progress < 100"
              :nuxt="!noLinkMode"
              :exact="!noLinkMode"
              :to="noLinkMode ? undefined : generateNuxtRoute('offline-worksheet')"
            >
              <v-list-item-content>
                <v-list-item-title :class="['dashboard-panel-worksheet-text', { 'dashboard-item-disabled': videos.progress < 100 }]">
                  HANDS-ON LEARNING
                </v-list-item-title>
                <v-list-item-subtitle v-if="noLinkMode">
                  Completed: {{ worksheets.OFFLINE.completed ? 'Yes' : 'No' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-if="worksheets.OFFLINE"
              class="dashboard-item"
              :disabled="videos.progress < 100"
            >
              <v-list-item-content>
                <v-btn
                  id="download-worksheet-btn"
                  class="dashboard-panel-worksheet-btn white--text"
                  color="#dce7b5"
                  :disabled="videos.progress < 100 || noLinkMode"
                  block
                  nuxt
                  exact
                  :to="generateNuxtRoute('offline-worksheet')"
                >
                  <v-icon color="white" left>
                    pg-icon-play
                  </v-icon>
                  <!-- <pg-icon /> -->
                  WORKSHEET VIDEOS
                </v-btn>

                <v-btn
                  id="download-worksheet-btn"
                  class="dashboard-panel-worksheet-btn white--text mt-2"
                  color="#dce7b5"
                  :disabled="videos.progress < 100 || noLinkMode"
                  block
                  @click.stop="openPdf"
                >
                  <v-icon color="white" left>
                    pg-icon-download
                  </v-icon>
                  <!-- <pg-icon /> -->
                  DOWNLOAD WORKSHEET
                </v-btn>

                <v-btn
                  v-if="!displayMode"
                  id="upload-worksheet-btn"
                  class="dashboard-panel-worksheet-btn white--text mt-2"
                  color="primary"
                  :disabled="videos.progress < 100"
                  block
                  @click.stop="uploadDialog = true"
                >
                  <v-icon color="white" left>
                    pg-icon-camera
                  </v-icon>
                  <!-- <pg-icon /> -->
                  UPLOAD WORKSHEET
                </v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </content-section>

        <content-section
          number="3"
          title="Activities"
          :progress="activities.progress"
          :progress-next="activities.progressNext"
          :enabled="videos.progress === 100"
        >
          <content-list :items="activities.items" v-bind="{ noLinkMode }" />
        </content-section>
      </div>

      <div
        v-if="nextButton"
        class="dashboard-panel-next"
        :class="{'clickable': !loadingNext, 'dashboard-panel-next-disabled': loadingNext || loading }"
        @click.stop="advance"
      >
        GO TO NEXT LESSON <img class="dashboard-panel-next-arrow" src="@/assets/svg/next-arrow.svg">
      </div>
    </v-card>
    <upload-offline-worksheet v-if="!displayMode" v-model="uploadDialog" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import DashboardMixin from '@/mixins/DashboardMixin'
// import PgCircleLetterDay from '@/components/pg/components/PgCircleLetterDay'
import UploadOfflineWorksheet from './worksheets/UploadOfflineWorksheet'
import ContentSection from './ContentSection.vue'
import ContentList from './ContentList.vue'

export default {
  name: 'DashboardPanel',

  components: {
    // PgCircleLetterDay,
    UploadOfflineWorksheet,
    ContentSection,
    ContentList
  },

  mixins: [DashboardMixin],

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

    childId: {
      validator: (val) => {
        return val === null || typeof val === 'number'
      },
      required: false,
      default: null
    }
  },

  data: () => {
    return {
      uploadDialog: false,
      loadingNext: false
    }
  },

  computed: {
    offlineWorksheet () {
      if (this.lesson) {
        return this.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
      }
      return null
    },

    completedOnlineWorksheets () {
      let completed = 0
      this.worksheets.ONLINE.forEach((worksheet) => {
        if (worksheet.completed) {
          completed++
        }
      })
      return completed
    }
  },

  methods: {
    ...mapActions('children/lesson', ['getAdvanceLessonChildren']),

    openPdf () {
      if (this.offlineWorksheet) {
        window.open(this.offlineWorksheet.pdfUrl, '_blank')
      }
    },

    openCourseProgress () {
      if (!this.displayMode) {
        this.$nuxt.$emit('show-curriculum-progress', this.lesson.curriculumType.id)
      }
    },

    advance () {
      try {
        if (!this.loadingNext) {
          this.loadingNext = true
          this.getAdvanceLessonChildren(this.childId).then(() => {
            this.$nuxt.$emit('dashboard-panel-update')
            this.loadingNext = false
          })
        }
      } catch (e) {
        if (e.errorCode === 100) {
          this.loadingNext = false
          this.$router.push({
            name: 'app-all-done'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.dashboard-panel {
  &-container {
    height: 100%;
    padding-top: 70px;
    max-width: 471px;
    @media screen and (max-width: 470px) {
      max-width: calc(100vw - 24px);
    }
  }

  &-card {
    padding-top: 87px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    &-border-top {
      width: 100%;
      height: 18px;
      position: absolute;
      top: 0;
      background-color: var(--v-primary-base);
      border-radius: 5px;
    }
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

#download-worksheet-btn.v-btn--disabled, #download-worksheet-btn.v-btn--disabled i.v-icon, #upload-worksheet-btn.v-btn--disabled, #upload-worksheet-btn.v-btn--disabled i.v-icon {
  color: white !important;
  font-size: 18px !important;
  font-weight: bold !important;
  letter-spacing: 0.04em !important;
}
</style>
