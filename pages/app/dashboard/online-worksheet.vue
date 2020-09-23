<template>
  <v-card height="100%">
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
      :return-text="false"
      :time-out-action="buttons[0].action"
    >
      <template v-slot:title>
        <span class="white--text text-h3 font-weight-medium">
          Coming Next:
        </span>
      </template>
      <p class="text-center font-weight-medium white--text">
        Hands-on learning is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
      </p>
    </completed-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import WorksheetComputedMixin from '@/mixins/WorksheetComputedMixin.js'
import WorksheetFunctionalityMixin from '@/mixins/WorksheetFunctionalityMixin.js'
import WorksheetHeader from '@/components/app/dashboard/worksheets/WorksheetHeader.vue'
import WorksheetQuestion from '@/components/app/dashboard/worksheets/WorksheetQuestion.vue'
import WorksheetImage from '@/components/app/dashboard/worksheets/WorksheetImage.vue'
import WorksheetContinueBtn from '@/components/app/dashboard/worksheets/WorksheetContinueBtn.vue'
import WorksheetMessage from '@/components/app/dashboard/worksheets/WorksheetMessage.vue'
import CompletedDialog from '@/components/app/dashboard/CompletedDialog.vue'

export default {
  name: 'OnlineWorksheet',

  components: {
    WorksheetHeader,
    WorksheetQuestion,
    WorksheetImage,
    WorksheetContinueBtn,
    WorksheetMessage,
    CompletedDialog
  },

  mixins: [WorksheetComputedMixin, WorksheetFunctionalityMixin],

  data: () => {
    return {
      dialog: false,
      completed: false,
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

    overrides () {
      return {
        childId: this.$route.query.childId,
        lessonId: this.$route.query.lessonId
      }
    },

    buttons () {
      return [
        {
          text: 'GO TO ACTIVITIES',
          color: 'accent',
          iconLeft: 'mdi-play',
          action: () => {
            const activities = this.lesson.lessonsActivities.map(({ activity }) => activity)
            if (activities.length) {
              this.$router.push({
                name: 'app-dashboard-lesson-activities',
                query: { ...this.overrides, id: this.getLesson.lessonsActivities[0].id }
              })
            }
          }
        },
        {
          text: 'DOWNLOAD HANDS-ON WORKSHEET',
          color: '#FEC572',
          iconLeft: 'mdi-download-outline',
          action: () => {
            this.$router.push({ name: 'app-dashboard-offline-worksheet', query: { ...this.overrides } })
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
