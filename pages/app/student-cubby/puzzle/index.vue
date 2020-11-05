<template>
  <v-card flat class="pt-0 pt-md-3">
    <v-card-text class="text-center pt-0 pt-md-3">
      <underlined-title
        class="text-h5 text-md-h3"
        text="Complete the puzzle!"
      />

      <p class="mt-2">
        Complete each letter in the curriculum to unlock a new puzzle piece!
      </p>

      <v-row justify="center">
        <puzzle-cover
          v-if="backgroundImage"
          :background-image="backgroundImage"
          :columns="columns"
          :rows="rows"
          :uncover="uncover"
          :student-id="studentId"
        />
      </v-row>

      <v-row class="mt-2" justify="center">
        <v-btn
          color="primary"
          nuxt
          :to="{
            name: 'app-student-cubby-puzzle-list',
            query: { id: studentId },
          }"
        >
          VIEW ALL PUZZLES
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { get } from 'lodash'

import PuzzleCover from '@/components/app/student-cubby/PuzzleCover'

export default {
  name: 'Index',

  components: {
    PuzzleCover
  },

  data: () => ({
    backgroundImage: null,
    columns: 5,
    rows: 1,
    uncover: 0
  }),

  computed: {
    studentId () {
      return this.$route.query.id
    }
  },

  watch: {
    studentId () {
      this.getUncoverPieces()
      this.getPuzzle()
    }
  },

  created () {
    if (this.studentId) {
      this.getUncoverPieces()
      this.getPuzzle()
    }
  },

  methods: {
    ...mapActions('children/puzzle', [
      'getPuzzleActiveByChildId',
      'getPuzzleByChildId'
    ]),

    async getUncoverPieces () {
      if (this.studentId) {
        try {
          const { pieces } = await this.getPuzzleByChildId({
            id: this.studentId
          })

          this.uncover = pieces
        } catch (e) {}
      }
    },

    async getPuzzle () {
      if (this.studentId) {
        try {
          const { puzzle } = await this.getPuzzleActiveByChildId({
            id: this.studentId
          })

          this.backgroundImage = get(puzzle, 'image')
          this.columns = get(puzzle, 'columns', 5)
          this.rows = get(puzzle, 'rows', 1)
        } catch (e) {}
      }
    }
  }
}
</script>
