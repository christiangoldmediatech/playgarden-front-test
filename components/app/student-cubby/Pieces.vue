<template>
  <v-card flat class="pt-0 pt-md-3">
    <v-card-text class="pt-0 pt-md-3">
      <underlined-title
        class="text-h5 text-md-h3"
        :text="`PUZZLE LETTER ${letter}`"
      />
      <v-row no-gutters>
        <v-col :cols="($vuetify.breakpoint.smAndDown) ? '12' : '8'">
          <p class="mt-2">
            <span :class="($vuetify.breakpoint.smAndDown) ? 'text-pieces' : ''">
              Look at all the pieces you have got!
            </span>
          </p>
        </v-col>
        <v-col v-if="!$vuetify.breakpoint.smAndDown">
          <div>
            <span class="font-weight-black text-progress">
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
              <v-col v-if="!$vuetify.breakpoint.smAndDown" class="mt-n2">
                <span class="ml-2 font-weight-black text-progress-puzzle ">
                  {{ puzzle.piecesUnclocked * 4 }}/{{ puzzle.pieces * 4 }}
                </span>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-row justify="center">
      <v-col>
        <puzzle-cover
          v-if="backgroundImage"
          :class="(!$vuetify.breakpoint.smAndDown) ? 'ml-6' : ''"
          :background-image="backgroundImage"
          :columns="columns"
          :rows="rows"
          :uncover="uncover"
          :student-id="studentId"
        />
      </v-col>
      <v-col v-if="!$vuetify.breakpoint.smAndDown" class="mt-12" cols="2">
        <v-row justify="end" no-gutters>
          <pg-social-buttons
            class="mr-3"
            entity-auto-resolve
            :entity-id="puzzle.puzzleChildrenId"
            entity-type="PUZZLE"
            mini-variant
            :url="puzzle.src"
          />
        </v-row>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12">
        <div class="mx-3">
          <center>
            <span class="text-progress">
              PROGRESS
            </span>
            <v-row justify="center" no-gutters>
              <span class="ml-2 text-pieces">
                {{ puzzle.piecesUnclocked * 4 }}/{{ puzzle.pieces * 4 }}
              </span>
              <v-progress-linear
                class="white"
                color="accent"
                height="10"
                :value="puzzle.percentageCompleted"
              />
            </v-row>
          </center>
        </div>
      </v-col>
    </v-row>
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
    dialog: false,
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

<style>
.text-progress {
  font-family: Poppins !important;
  font-style: normal !important;
  font-weight: bold !important;
  font-size: 20px !important;
  line-height: 30px !important;
  letter-spacing: 6px !important;
  text-transform: uppercase !important;
}

.text-progress-puzzle {
  font-family: Poppins !important;
  font-style: normal !important;
  font-weight: bold !important;
  color: #A7A7A7 !important;
}

.text-pieces {
  font-size: 13px !important;
  color: #A7A7A7 !important;
  font-weight: bold !important;
  font-family: Poppins !important;
}
</style>
