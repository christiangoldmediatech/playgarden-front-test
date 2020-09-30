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
        <worksheet-continue-btn v-bind="{ selected }" @click.stop="dialog = true" />
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
      return-text="Return to dashboard"
      :time-out="false"
    >
      <template v-slot:title>
        <underlined-title
          class="white--text"
          font-size="56px"
          font-weight="bold"
          :text="offlineWorksheet && offlineWorksheet.completed ? 'Congratulations!' : 'Coming Next:'"
        />
      </template>
      <p class="text-center font-weight-medium white--text mt-2">
        <template v-if="offlineWorksheet && offlineWorksheet.completed">
          <span class="font-weight-bold white--text">You have completed the hands-on learning experience.</span>
        </template>
        <template v-else>
          <span class="font-weight-bold white--text">HANDS-ON LEARNING</span> is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
        </template>
      </p>
    </completed-dialog>

    <upload-offline-worksheet v-model="uploadDialog" />

    <teacher-video-overlay
      v-model="teachersVideoDialog"
      :video="offlineWorksheet ? offlineWorksheet.videoDetail : undefined"
    />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import DashboardLink from '@/mixins/DashboardLinkMixin.js'
import WorksheetComputedMixin from '@/mixins/WorksheetComputedMixin.js'
import WorksheetFunctionalityMixin from '@/mixins/WorksheetFunctionalityMixin.js'

export default {
  name: 'OnlineWorksheetCard',

  mixins: [DashboardLink, WorksheetComputedMixin, WorksheetFunctionalityMixin],

  data: () => {
    return {
      dialog: false,
      completed: false,
      teachersVideoDialog: false,
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
        return this.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
      }
      return null
    },

    buttons () {
      const buttons = []

      const goToTeachersVideo = {
        text: 'GO TO TEACHER\'S VIDEO',
        color: 'accent',
        iconLeft: 'pg-icon-paper-pencil',
        action: () => {
          this.teachersVideoDialog = true
          this.showTeachers = false
        }
      }

      const downloadHandsOn = {
        text: 'DOWNLOAD HANDS-ON WORKSHEET',
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
        text: 'UPLOAD COMPLETED WORKSHEET',
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
          buttons.push(uploadHandsOn)
        } else {
          buttons.push(downloadHandsOn)
        }
      }

      return [
        ...buttons,
        {
          text: 'SKIP TO ACTIVITIES',
          color: '#FEC572',
          iconLeft: 'pg-icon-play',
          action: () => {
            const activities = this.lesson.lessonsActivities.map(({ activity }) => activity)
            if (activities.length) {
              this.$router.push(this.generateNuxtRoute('lesson-activities', { id: activities[0].id }))
            }
          }
        }
      ]
    }
  },

  watch: {
    selected (val) {
      if (val) {
        if (this.connectingPairs) {
          if (this.selectedItem.word === this.randomWord) {
            this.correct = true
            return
          }
        } else if (this.tapCorrect) {
          this.correct = this.selectedItem.is_correct
          return
        }
      }
      this.correct = false
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
