<template>
  <v-card flat class="pt-0 pt-md-3">
    <v-card-text class="pt-0 pt-md-3">
      <underlined-title
        class="text-h5 text-md-h3"
        :text="`PUZZLE LETTER ${letter}`"
      />
      <v-row no-gutters>
        <v-col cols="8">
          <p class="mt-2">
            Look at all the pieces you have got!
          </p>
        </v-col>
        <v-col>
          <div>
            <span class="font-weight-black">
              PROGRESS
            </span>
            <v-row no-gutters>
              <v-col cols="10">
                <v-progress-linear
                  class="white"
                  color="accent"
                  height="10"
                  :value="puzzle.percentageCompleted"
                />
              </v-col>
              <v-col class="mt-n2">
                <span class="ml-2 font-weight-black">
                  {{ puzzle.piecesUnclocked * 4 }}/{{ puzzle.pieces * 4 }}
                </span>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col>
          <puzzle-cover
            v-if="backgroundImage"
            :background-image="backgroundImage"
            :columns="columns"
            :rows="rows"
            :uncover="uncover"
            :student-id="studentId"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

import PuzzleCover from '@/components/app/student-cubby/PuzzleCover'

export default {
  name: 'Pieces',

  components: {
    PuzzleCover
  },

  props: {
    puzzle: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  data: () => ({
    backgroundImage: null,
    columns: 5,
    rows: 1,
    uncover: 0,
    letter: ''
  }),

  computed: {
    studentId () {
      return this.$route.query.id
    }
  },

  watch: {
    studentId () {
      this.getPuzzle()
    }
  },

  created () {
    if (this.puzzle) {
      this.getPuzzle()
    }
  },

  methods: {
    ...mapActions('children/puzzle', [
      'getPuzzleActiveByChildId',
      'getPuzzleByChildId'
    ]),

    getPuzzle () {
      if (this.puzzle) {
        this.backgroundImage = this.puzzle.src
        this.columns = 5
        this.rows = 1
        this.uncover = this.puzzle.piecesUnclocked
        this.letter = this.puzzle.letter
      }
    }
  }
}
</script>
