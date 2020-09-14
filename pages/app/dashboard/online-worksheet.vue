<template>
  <v-card class="row mx-0 flex-column flex-nowrap" height="100%">
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-col class="d-flex flex-column justify-end align-content-center flex-shrink-1 title-section py-0 py-md-2">
      <span class="text-center text-h4 text-uppercase font-weight-bold">
        Online Worksheet
      </span>

      <!-- Progress -->
      <v-row class="flex-grow-0" justify="center">
        <v-col cols="12" sm="8" md="6" lg="3" xl="2">
          <v-row no-gutters>
            <v-col cols="12">
              <v-progress-linear
                height="13"
                rounded
                :value="progress"
              />
            </v-col>
            <v-col
              v-for="i in stepCount"
              :key="`question-marker-${i}`"
              class="text-center"
            >
              <span
                :class="['font-weight-bold', { 'primary--text': step >= i }]"
              >
                {{ i }}
              </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="currentSheet && !finished" class="pt-0 pt-md-2">
      <component
        :is="type"
        v-bind="{ question: worksheetTable.question, images, lastQuestion, loading }"
        @next="nextPage"
      />
    </v-col>

    <completed-dialog
      v-model="finished"
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
import { mapGetters, mapActions } from 'vuex'
import ConnectingPairs from '@/components/app/dashboard/worksheets/ConnectingPairs.vue'
import TapCorrect from '@/components/app/dashboard/worksheets/TapCorrect.vue'
import CompletedDialog from '@/components/app/dashboard/CompletedDialog.vue'

export default {
  name: 'OnlineWorksheet',

  components: {
    ConnectingPairs,
    TapCorrect,
    CompletedDialog
  },

  data: () => {
    return {
      step: 1,
      loading: false,
      finished: false
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', ['getLesson']),

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
            this.$router.push({
              name: 'app-dashboard-lesson-activities',
              query: { ...this.overrides, id: this.getLesson.lessonsActivities[0].activity.id }
            })
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
    },

    sheets () {
      if (this.getLesson) {
        return this.getLesson.worksheets.filter(({ type }) => type === 'ONLINE')
      }
      return []
    },

    stepCount () {
      return this.sheets.length
    },

    lastQuestion () {
      return this.step === this.stepCount
    },

    progress () {
      if (this.stepCount) {
        return Math.round((this.step / this.stepCount) * 100)
      }
      return 0
    },

    currentSheet () {
      return this.sheets[this.step - 1] || null
    },

    worksheetTable () {
      return this.currentSheet.worksheetTable || null
    },

    type () {
      const type = this.worksheetTable.type || null

      if (type === 'CONNECTING_PAIRS') {
        return 'ConnectingPairs'
      }

      if (type === 'TAP_CORRECT') {
        return 'TapCorrect'
      }

      return ''
    },

    images () {
      return this.worksheetTable.images || []
    }
  },

  methods: {
    ...mapActions('children/lesson', ['saveWorksheetProgress']),

    nextPage () {
      this.loading = true
      const promises = []

      const date = new Date().toISOString().substr(0, 19)
      this.children.forEach((child) => {
        this.saveWorksheetProgress({
          lessonId: this.getLesson.id,
          childId: child.id,
          worksheet: {
            id: this.currentSheet.id,
            completed: true,
            date
          }
        })
      })

      Promise.all(promises).then(() => {
        this.$nuxt.$emit('dashboard-panel-update')
        if (this.step < this.stepCount) {
          this.step++
        } else {
          this.finished = true
        }
        this.loading = false
      })
    }
    // prevPage () {
    //   if (this.finished) {
    //     this.finished = false
    //     return
    //   }
    //   if (this.step > 1) {
    //     this.step--
    //   }
    // },
  }
}
</script>

<style lang="scss" scoped>
.title-section {
  max-height: calc(33% - 2rem);
  /* max-height: 33%; */
}
</style>
