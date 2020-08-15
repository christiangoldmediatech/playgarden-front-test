<template>
  <v-card>
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-card-text>
      <v-btn
        color="primary"
        class="py-2"
        text
        @click.stop="prevPage"
      >
        <v-icon left>
          mdi-less-than
        </v-icon>
        Back
      </v-btn>
      <template v-if="currentSheet">
        <span class="d-block text-center text-h6 text-uppercase font-weight-bold">
          Online Worksheet
        </span>

        <!-- Progress -->
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
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

        <component :is="type" v-bind="{ images }" @next="nextPage" />
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ConnectingPairs from '@/components/app/dashboard/worksheets/ConnectingPairs.vue'
import TapCorrect from '@/components/app/dashboard/worksheets/TapCorrect.vue'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'OnlineWorksheet',

  components: {
    ConnectingPairs,
    TapCorrect
  },

  data: () => {
    return {
      step: 1
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    sheets () {
      if (this.getLesson) {
        return this.getLesson.worksheets.filter(({ type }) => type === 'ONLINE')
      }
      return []
    },

    stepCount () {
      return this.sheets.length
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
    nextPage () {
      if (this.step < this.stepCount) {
        this.step++
      }
    },

    prevPage () {
      if (this.step > 1) {
        this.step--
      }
    }
  }
}
</script>
