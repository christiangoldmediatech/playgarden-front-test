<template>
  <v-card class="dashboard-content-card-2">
    <template v-if="worksheets.length">
      <div class="d-flex justify-center w-100 dashboard-content-bars">
        <img src="@/assets/svg/color-bars.svg" width="80%" />
      </div>
      <div class="dashboard-content-card-2-content">
        <ow-header
          :day="lesson.day"
          v-bind="{ worksheets, index, question }"
        />
        <component :is="type" v-bind="{ question }" @next-question="onNextQuestion" />
      </div>
    </template>
    <completed-dialog
      v-model="completed"
      :buttons="buttons"
      :return-action="returnAction"
      :time-out="false"
      :z-index="2000"
    >
      <template v-slot:title>
        <normal-title
          class="white--text"
          font-size="38px"
          font-size-mobile="1.4rem"
          font-weight="normal"
          text="Coming next!"
        />
      </template>
      <p class="text-center font-weight-medium white--text mt-2 pg-font-quick pg-text-sm md:pg-text-xl">
        <template v-if="showTeachers">
          <span class="font-weight-bold white--text ">HANDS-ON LEARNING</span>
          is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
        </template>
      </p>
    </completed-dialog>

    <upload-offline-worksheet-dialog v-model="uploadDialog" />
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DashboardLink from '@/mixins/DashboardLinkMixin.js'
import { APP_EVENTS } from '@/models'

import CompletedDialog from '@/components/app/dashboard/CompletedDialog'
import UploadOfflineWorksheetDialog from '../UploadOfflineWorksheetDialog.vue'
import OwHeader from './OwHeader.vue'
import OwConnectingPairs from './OwConnectingPairs.vue'
import OwTapCorrect from './OwTapCorrect.vue'
import OwAudio from './OwAudio.vue'

export default {
  name: 'OwCard',

  components: {
    OwHeader,
    OwConnectingPairs,
    OwTapCorrect,
    OwAudio,
    UploadOfflineWorksheetDialog,
    CompletedDialog
  },

  mixins: [DashboardLink],

  data: () => {
    return {
      index: 0,
      completed: false,
      showTeachers: true,
      downloaded: false,
      uploadDialog: false
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),

    worksheets () {
      if (this.lesson) {
        return this.lesson.worksheets.filter(({ type }) => type === 'ONLINE')
      }
      return []
    },

    question () {
      if (this.worksheets.length) {
        return this.worksheets[this.index]
      }
      return null
    },

    lastQuestion () {
      return this.worksheets.length - 1 === this.index
    },

    type () {
      if (this.question) {
        const type = this.question.worksheetTable?.type
        if (type === 'CONNECTING_PAIRS') {
          return 'ow-connecting-pairs'
        } else if (type === 'TAP_CORRECT') {
          return 'ow-tap-correct'
        } else if (type === 'AUDIO') {
          return 'ow-audio'
        }
      }
      return ''
    },

    offlineWorksheet () {
      if (this.lesson) {
        const offline = this.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
        if (offline) {
          const copy = JSON.parse(JSON.stringify(offline))
          copy.completed = false
          return copy
        }
      }
      return null
    },

    buttons () {
      const buttons = []

      const goToTeachersVideo = {
        text: 'TEACHERS VIDEO',
        color: '#F89838',
        iconLeft: 'pg-icon-paper-pencil',
        action: () => {
          const playlist = [
            {
              title: '',
              src: {
                url: this.offlineWorksheet.videoDetail.videoUrl.HLS,
                type: 'application/x-mpegURL'
              },
              meta: {
                videoId: this.offlineWorksheet.videoDetail.id
              }
            }
          ]

          this.$nuxt.$emit('open-lesson-teacher-video', {
            playlist, index: 0
          })

          this.showTeachers = false

          this.$nextTick(() => {
            this.downloaded = true
          })
        }
      }

      const downloadHandsOn = {
        text: 'DOWNLOAD WORKSHEET',
        color: '#FFAB37',
        iconLeft: 'pg-icon-download',
        action: () => {
          if (this.offlineWorksheet) {
            this.downloaded = true
            window.open(this.offlineWorksheet.pdfUrl, '_blank')
          }
        }
      }

      const uploadHandsOn = {
        text: this.$vuetify.breakpoint.xsOnly ? 'UPLOAD WORKSHEET' : 'UPLOAD COMPLETED WORKSHEET',
        color: '#FFAB37',
        iconLeft: 'pg-icon-camera',
        action: () => {
          this.uploadDialog = true
        }
      }

      if (this.offlineWorksheet && !this.offlineWorksheet.completed) {
        if (this.showTeachers && this.offlineWorksheet.videoDetail) {
          buttons.push(goToTeachersVideo)
        }

        if (this.downloaded) {
          if (this.offlineWorksheet && !this.offlineWorksheet.completed) {
            buttons.push(uploadHandsOn)
          }
        } else {
          buttons.push(downloadHandsOn)
        }
      }

      const result = [
        ...buttons
      ]

      const activities = this.lesson.lessonsActivities.map(({ activity }) => activity)
      if (activities.length > 0) {
        result.push({
          text: 'GO TO ACTIVITIES',
          color: '#FFAB37',
          iconLeft: 'pg-icon-play',
          action: () => {
            if (activities.length) {
              const validActivities = this.lesson.lessonsActivities.filter(({ activity }) => {
                return activity.videos.videoUrl
              })

              const playlist = validActivities.map(({ id, activity }) => {
                return {
                  title: activity.activityType.name,
                  description: activity.videos.description,
                  poster: activity.videos.image,
                  src: {
                    url: activity.videos.videoUrl.HLS,
                    type: 'application/x-mpegURL'
                  },
                  meta: {
                    videoId: activity.videos.id,
                    author: `with ${activity.videos.name}`,
                    videoType: 'LESSON ACTIVITIES',
                    videoIcon: activity.activityType.icon,
                    lessonActivityId: id,
                    activityId: activity.id,
                    activityType: activity.activityType,
                    curriculumType: activity.curriculumType,
                    viewed: activity.viewed
                  }
                }
              })

              this.$nuxt.$emit('open-lesson-activity-player', { playlist, index: 0 })
              this.$router.push(this.generateNuxtRoute('lesson-activities', { id: activities[0].id }))
            }
          }
        })
      }

      result[0].color = 'accent'

      return result
    }
  },

  watch: {
    '$route.query.worksheet' () {
      this.index = this.getValidIndexFromQuery()
    }
  },

  mounted () {
    this.index = this.getValidIndexFromQuery()
  },

  methods: {
    ...mapActions('children/lesson', ['saveWorksheetProgress']),

    /**
     * Default to 0 if index is overflowed.
     */
    getValidIndexFromQuery () {
      const index = Number(this.$route.query.worksheet) || 0

      if (index < this.worksheets.length) {
        return index
      }

      return 0
    },

    returnAction () {
      this.$router.push(this.generateNuxtRoute('offline-worksheet'))
    },

    async saveProgress () {
      const date = new Date().toISOString().substr(0, 19)

      await this.saveWorksheetProgress({
        lessonId: this.lesson.id,
        childId: this.children[0].everyone ? this.children[0].allIds : this.children[0].id,
        worksheet: {
          id: this.question.id,
          completed: true,
          date
        }
      })

      this.$nuxt.$emit('dashboard-panel-update')
    },

    async onNextQuestion () {
      await this.saveProgress()
      if (this.lastQuestion) {
        this.$nuxt.$emit(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_COMPLETED)
        if (this.lesson.curriculumType.name !== 'Intro') {
          this.completed = true
        } else {
          this.returnAction()
        }
      } else {
        this.index += 1
        this.$router.push(this.generateNuxtRoute('online-worksheet', {
          ...this.$route.query,
          worksheet: `${this.index}`
        }))
        this.$nuxt.$emit('reset-question')
      }
    }
  }
}
</script>

<style lang="scss">
.dashboard-content {
  &-card-2 {
    display: block;
    position: relative;
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    padding-top: 20px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
    @media screen and (min-width: 600px) {
      padding-top: 32px;
    }
    @media screen and (min-width: 960px) {
      height: 100%;
    }
    &-content {
      height: 100%;
      max-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      @media screen and (min-height: 864px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
  &-bars {
    position: absolute;
    top: 0;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
