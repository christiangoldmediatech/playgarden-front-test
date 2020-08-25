<template>
  <v-card>
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-card-text>
      <template v-if="currentSheet && !finished">
        <span class="d-block text-center text-h4 text-uppercase font-weight-bold">
          Online Worksheet
        </span>

        <!-- Progress -->
        <v-row justify="center">
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

        <!-- Question -->
        <span class="d-block text-center font-weight-bold">
          {{ worksheetTable.question }}
        </span>

        <component
          :is="type"
          v-bind="{ images, lastQuestion }"
          @next="nextPage"
        />
      </template>
    </v-card-text>
    <completed-message
      v-model="finished"
      :buttons="buttons"
      :return-action="returnAction"
      :time-out-action="buttons[0].action"
    >
      <template v-slot:title>
        <span class="white--text text-h3 font-weight-medium">
          Coming Next:
        </span>
      </template>
      <p class="text-center font-weight-medium">
        Hands-on learning is a crucial part of the educational experience. Learning through doing strengthens the cognitive connections and builds a strong foundation for knowledge.
      </p>
    </completed-message>
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

    buttons () {
      return [
        {
          text: 'COMPLETE WORKSHEETS',
          color: 'accent',
          iconLeft: 'mdi-square-edit-outline',
          action: () => {
            this.$router.push({ name: 'app-dashboard-online-worksheet' })
          }
        },
        {
          text: 'DOWNLOAD HANDS-ON WORKSHEET',
          color: '#FEC572',
          iconLeft: 'mdi-download-outline',
          action: () => {}
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
      if (this.step < this.stepCount) {
        this.step++
      } else {
        this.finished = true
      }

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
    },
    // prevPage () {
    //   if (this.finished) {
    //     this.finished = false
    //     return
    //   }
    //   if (this.step > 1) {
    //     this.step--
    //   }
    // },
    returnAction () {
      const id = this.getLesson.videos[0].id
      this.$router.push({
        name: 'app-dashboard-videos-id',
        params: { id }
      })
    }
  }
}
</script>
