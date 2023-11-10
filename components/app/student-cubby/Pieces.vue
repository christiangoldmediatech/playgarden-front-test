<template>
  <v-card flat class="pieces">
    <v-card-text class="content pt-4 pt-md-3">
      <v-row no-gutters class="mx-4">
        <v-col cols="8">
          <underlined-title
            class="text-h5 text-md-h3"
            :text="$t('studentCubby.puzzle.puzzleLetter', {letter: letter})"
          />
          <p class="mt-2 mb-0">
            <span :class="$vuetify.breakpoint.smAndDown ? 'text-pieces' : ''">
              {{ $t('studentCubby.puzzle.piecesDesc') }}
            </span>
          </p>
        </v-col>
        <v-col
          v-if="
            !$vuetify.breakpoint.smAndDown &&
              puzzle.piecesUnclocked < puzzle.pieces
          "
          class="d-flex"
        >
          <div class="mt-auto w-100">
            <span class="font-weight-black text-progress">
              {{ $t('studentCubby.puzzle.progress') }}
            </span>
            <v-row no-gutters>
              <v-col cols="9">
                <v-progress-linear
                  class="white"
                  color="accent"
                  height="10"
                  :value="puzzle.percentageCompleted"
                />
              </v-col>
              <v-col v-if="!$vuetify.breakpoint.smAndDown" class="mt-n2">
                <span class="ml-2 font-weight-black text-progress-puzzle ">
                  {{ puzzle.piecesUnclocked }}/{{ puzzle.pieces }}
                </span>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col
          v-if="
            puzzle.piecesUnclocked >= puzzle.pieces && !$vuetify.breakpoint.xs
          "
          class="d-flex align-center"
        >
          <v-btn
            class="elevation-0 ml-auto"
            fab
            :large="!$vuetify.breakpoint.smAndDown"
            color="#68C453"
            @click="printPuzzle"
          >
            <img src="@/assets/svg/printer.svg" alt="printer icon" />
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col id="puzzle" class="mx-4">
          <puzzle-cover
            v-if="backgroundImage"
            :background-image="backgroundImage"
            :columns="columns"
            :rows="rows"
            :uncover="uncover"
            :student-id="studentId"
            :letter="letter"
          />
        </v-col>
        <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12">
          <div class="mx-3">
            <center>
              <span
                v-if="puzzle.piecesUnclocked !== puzzle.pieces"
                class="text-progress"
              >
                {{ $t('studentCubby.puzzle.progress') }}
              </span>
              <v-row justify="center" no-gutters>
                <v-col
                  v-if="puzzle.piecesUnclocked !== puzzle.pieces"
                  cols="12"
                >
                  <span class="ml-2 text-pieces">
                    {{ puzzle.piecesUnclocked }}/{{ puzzle.pieces }}
                  </span>
                  <v-progress-linear
                    class="white"
                    color="accent"
                    height="10"
                    :value="puzzle.percentageCompleted"
                  />
                </v-col>
              </v-row>
            </center>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

import PuzzleCover from '@/components/app/student-cubby/PuzzleCover.vue'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'

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
    studentId() {
      return this.$route.query.id
    }
  },

  watch: {
    studentId() {
      this.getPuzzle()
    },
    puzzle() {
      this.getPuzzle()
    }
  },

  created() {
    if (this.puzzle) {
      this.getPuzzle()
    }
  },

  methods: {
    ...mapActions('children/puzzle', [
      'getPuzzleActiveByChildId',
      'getPuzzleByChildId'
    ]),

    getPuzzle() {
      if (this.puzzle) {
        this.backgroundImage = this.puzzle.src
        this.columns = this.puzzle.columns || 5
        this.rows = this.puzzle.rows || 3
        this.uncover = this.puzzle.piecesUnclocked
        this.letter = this.puzzle.letter
      }
    },

    async printPuzzle() {
      const puzzle = document.getElementById('puzzle')
      const data = await html2canvas(puzzle)
      const img = data.toDataURL('image/png')
      const element = document.createElement('img')
      element.src = img
      element.style.width = '100%'
      html2pdf()
        .set({
          margin: 1,
          filename: `puzzle-letter-${this.letter}.pdf`,
          jsPDF: { orientation: 'landscape', format: 'a4' }
        })
        .from(element)
        .toImg()
        .save()
    }
  }
}
</script>

<style lang="scss">
.pieces {
  max-width: 1264px;
  max-height: 90vh;
  overflow-y: scroll;
}

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
  color: #a7a7a7 !important;
}

.text-pieces {
  font-size: 13px !important;
  color: #a7a7a7 !important;
  font-weight: bold !important;
  font-family: Poppins !important;
}

@page {
  size: a4;
  margin: 0;
}

@media print {
  html,
  body {
    width: 210mm;
    height: 297mm;
  }

  body {
    overflow: hidden !important;
  }

  body * {
    visibility: hidden;
  }

  #puzzle,
  #puzzle * {
    visibility: visible;
  }
  #puzzle {
    overflow: hidden !important;
    width: 210mm;
    height: 297mm;
    transform: rotate(-90deg) scale(1.42);
    -webkit-transform: rotate(-90deg) scale(1.42);
    -moz-transform: rotate(-90deg) scale(1.42);
    position: fixed;
    bottom: 0;
    left: 120mm;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
