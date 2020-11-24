<template>
  <v-card class="dashboard-content-card" height="100%">
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />
    <div class="worksheet-content">
      <v-row justify="center">
        <worksheet-header v-bind="{ step }" />
        <worksheet-question v-bind="{ step, randomWord }" />
        <!-- Images Row -->
        <v-col class="py-0" cols="12">
          <v-row class="mx-2" justify="center" justify-md="space-around">
            <worksheet-image
              v-for="item in items"
              :key="`worksheet-image-${item.code}`"
              :item="item"
              :selected.sync="selected"
              :clickable="!loading"
              :show-word="tapCorrect"
            />
          </v-row>
        </v-col>
        <!-- <worksheet-continue-btn v-bind="{ selected }" @click.stop="dialog = true" /> -->
      </v-row>
    </div>

    <worksheet-message
      v-model="dialog"
      v-bind="{ item: selectedItem, selected, correct, showWord: tapCorrect, connectingPairs, tapCorrect, randomWord }"
      @click.stop="nextStep"
    >
      <v-icon v-if="!correct" left>
        mdi-less-than
      </v-icon>
      {{ `${correct ? buttonText : 'Go back'}` }}
      <v-icon v-if="correct" right>
        mdi-greater-than
      </v-icon>
    </worksheet-message>

    <completed-dialog
      v-model="completed"
      :buttons="buttons"
      :time-out="false"
    >
      <template v-slot:title>
        <underlined-title
          class="white--text"
          font-size="56px"
          font-size-mobile="1.9rem"
          font-weight="bold"
          :text="offlineWorksheet && offlineWorksheet.completed ? 'Congratulations!' : 'Coming Next:'"
        />
      </template>
      <p class="text-center font-weight-medium white--text mt-2">
        <template v-if="showTeachers">
          <span class="font-weight-bold white--text">HANDS-ON LEARNING</span> is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
        </template>
        <template v-else-if="offlineWorksheet && offlineWorksheet.completed">
          <span class="font-weight-bold white--text">You have completed the hands-on learning for the day.</span>
        </template>
        <template v-else>
          <span class="font-weight-bold white--text">You have completed your worksheet!</span>
        </template>
      </p>
    </completed-dialog>

    <upload-offline-worksheet v-model="uploadDialog" />

    <!-- <teacher-video-overlay
      v-model="teachersVideoDialog"
      :video="offlineWorksheet ? offlineWorksheet.videoDetail : undefined"
    /> -->
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import DashboardLink from '@/mixins/DashboardLinkMixin.js'
import WorksheetComputedMixin from '@/mixins/WorksheetComputedMixin.js'
import WorksheetFunctionalityMixin from '@/mixins/WorksheetFunctionalityMixin.js'

import CompletedDialog from '@/components/app/dashboard/CompletedDialog'
import WorksheetHeader from './WorksheetHeader.vue'
import WorksheetImage from './WorksheetImage.vue'
import WorksheetMessage from './WorksheetMessage.vue'
import WorksheetQuestion from './WorksheetQuestion.vue'
import UploadOfflineWorksheet from './UploadOfflineWorksheet.vue'

export default {
  name: 'OnlineWorksheetCard',

  components: {
    CompletedDialog,
    WorksheetHeader,
    WorksheetImage,
    WorksheetMessage,
    WorksheetQuestion,
    UploadOfflineWorksheet
  },

  mixins: [DashboardLink, WorksheetComputedMixin, WorksheetFunctionalityMixin],

  data: () => {
    return {
      dialog: false,
      completed: false,
      // teachersVideoDialog: false,
      showTeachers: true,
      downloaded: false,
      uploadDialog: false,
      step: 0,
      randomWord: null,
      answers: [],
      items: [],
      correct: false,
      selected: null,
      loading: false
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),

    id () {
      return this.$route.query.id
    },

    buttonText () {
      if (this.connectingPairs) {
        if (!this.lastWord) {
          return 'Next word'
        }
      }

      if (this.lastQuestion) {
        return 'Complete worksheet'
      }

      return 'Next question'
    },

    offlineWorksheet () {
      if (this.lesson) {
        // return this.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
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
        text: this.$vuetify.breakpoint.xsOnly ? 'TEACHER\'S VIDEO' : 'GO TO TEACHER\'S VIDEO',
        color: 'accent',
        iconLeft: 'pg-icon-paper-pencil',
        action: () => {
          const playlist = [
            {
              title: '',
              src: {
                src: this.offlineWorksheet.videoDetail.videoUrl.HLS,
                type: 'application/x-mpegURL'
              }
            }
          ]

          this.$nuxt.$emit('open-lesson-teacher-video', {
            playlist, index: 0
          })

          // this.teachersVideoDialog = true
          this.showTeachers = false
        }
      }

      const downloadHandsOn = {
        text: this.$vuetify.breakpoint.xsOnly ? 'DOWNLOAD WORKSHEET' : 'DOWNLOAD HANDS-ON WORKSHEET',
        color: '#FEC572',
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
        color: 'accent',
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
        ...buttons,
        {
          text: 'SKIP TO ACTIVITIES',
          color: '#FEC572',
          iconLeft: 'pg-icon-play',
          action: () => {
            const activities = this.lesson.lessonsActivities.map(({ activity }) => activity)
            if (activities.length) {
              const validActivities = this.lesson.lessonsActivities.filter(({ activity }) => {
                return activity.videos.videoUrl
              })

              const playlist = validActivities.map(({ id, activity }) => {
                return {
                  title: activity.videos.name,
                  description: activity.videos.description,
                  activityType: activity.activityType,
                  curriculumType: activity.curriculumType,
                  src: {
                    src: activity.videos.videoUrl.HLS,
                    type: 'application/x-mpegURL'
                  },
                  poster: activity.videos.thumbnail,
                  lessonActivityId: id,
                  activityId: activity.id,
                  videoId: activity.videos.id,
                  viewed: activity.viewed
                }
              })

              this.$nuxt.$emit('open-lesson-activity-player', { playlist, index: 0 })
              this.$router.push(this.generateNuxtRoute('lesson-activities', { id: activities[0].id }))
            }
          }
        }
      ]

      result[0].color = 'accent'

      return result
    }
  },

  watch: {
    selected (val) {
      this.correct = false
      if (val) {
        if (this.connectingPairs) {
          if (this.selectedItem.word === this.randomWord) {
            this.correct = true
          }
        } else if (this.tapCorrect) {
          this.correct = this.selectedItem.is_correct
        }
        this.dialog = true
      }
    }
  },

  created () {
    this.waitAndLoad()
  }
}
</script>

<style lang="scss">
.worksheet {
  &-content {
    height: calc(100% - 32px);
    display: flex;
    flex-flow: column;
    overflow-x: hidden;
    overflow-y: hidden;
  }
}
</style>
