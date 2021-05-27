<template>
  <v-card flat>
    <v-card-text class="text-center">
      <!-- Section Title and Description -->
      <div class="d-flex align-center justify-center">
        <img height="80px" src="@/assets/png/student-cubby/puzzle-piece.png">
        <span class="ml-4 text-h4 text-md-h3">PUZZLE</span>
      </div>
      <div class="my-6 text-md-h6 text-body-1">
        Find all of {{ child.firstName || "Child" }}’s completed puzzles. Share
        them on social media!
      </div>

      <v-row class="mt-6" justify="space-around">
        <v-col
          v-for="(puzzle, indexP) in puzzles"
          :key="indexP"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card
                class="my-3"
                :disabled="!puzzle.active"
                width="340"
              >
                <v-img
                  aspect-ratio="1.7"
                  :src="(puzzle.piecesUnclocked === puzzle.pieces) ? puzzle.src : ''"
                  :[puzzle.srcType]="
                    puzzle.lazy
                      ? puzzle.src
                      : require('@/assets/png/student-cubby/puzzle-piece.png')
                  "
                >
                  <template v-slot:placeholder>
                    <v-overlay absolute :value="true">
                      <v-lazy
                        v-model="puzzle.lazy"
                        :options="{
                          threshold: 0.5,
                        }"
                        transition="scroll-y-transition"
                      >
                        <v-card
                          v-if="puzzle.active"
                          color="transparent"
                          elevation="0"
                          width="300"
                        >
                          <v-row v-if="puzzle.piecesUnclocked !== puzzle.pieces" justify="center" no-gutters>
                            <span class="font-weight-black white--text">
                              {{ puzzle.piecesUnclocked }}/{{ puzzle.pieces }}
                            </span>

                            <v-progress-linear
                              class="mt-2 mx-4 white"
                              color="accent"
                              height="15"
                              :value="puzzle.percentageCompleted"
                            />
                            <v-btn
                              nuxt
                              small
                              color="accent"
                              class="mt-3 text-transform-none"
                              @click="showOverlay(puzzle)"
                            >
                              View Progress
                            </v-btn>
                          </v-row>
                        </v-card>

                        <v-icon v-else color="grey" size="100">
                          mdi-lock-outline
                        </v-icon>
                      </v-lazy>
                    </v-overlay>
                  </template>

                  <v-row class="fill-height" no-gutters>
                    <v-col align-self="end">
                      <v-row justify="end" no-gutters>
                        <pg-circle-letter-day
                          class="mb-3 mr-3"
                          :letter="puzzle.letter"
                          no-auto-position
                          size="50"
                        />
                      </v-row>
                    </v-col>
                  </v-row>
                </v-img>
                <v-fade-transition v-if="puzzle.piecesUnclocked === puzzle.pieces">
                  <v-overlay
                    v-if="hover"
                    absolute
                  >
                    <v-btn
                      nuxt
                      small
                      color="accent"
                      class="mt-3 text-transform-none"
                      @click="showOverlay(puzzle)"
                    >
                      View puzzle
                    </v-btn>
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
      </v-row>
    </v-card-text>

    <puzzle-pieces-dialog v-model="dialog" v-bind="{ toShow }" />
  </v-card>
</template>

<script>
import { get } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import PuzzlePiecesDialog from '@/components/app/student-cubby/PuzzlePiecesDialog.vue'

export default {
  name: 'Index',

  components: {
    PuzzlePiecesDialog
  },

  data: () => {
    return {
      dialog: false,
      puzzles: [],
      toShow: {}
    }
  },

  computed: {
    ...mapGetters('children', { children: 'rows' }),

    child () {
      return (
        this.children.find(({ id }) => id === Number(this.studentId)) || {}
      )
    },

    studentId () {
      return this.$route.query.id
    }
  },

  watch: {
    studentId () {
      if (!this.loading) {
        this.fetchPuzzles()
      }
    }
  },

  created () {
    this.fetchPuzzles()
  },

  methods: {
    ...mapActions('children/puzzle', ['findPuzzlesByChildrenId']),

    async fetchPuzzles (clear = false) {
      this.loading = true

      if (clear) {
        this.search = null
      }
      try {
        const puzzles = await this.findPuzzlesByChildrenId({
          id: this.studentId
        })

        this.puzzles = puzzles.map(
          ({
            id,
            active = false,
            completed = false,
            curriculumType,
            image = '',
            name = '',
            pieces = 0,
            piecesUnclocked = 0,
            puzzleChildrenId
          }) => ({
            id,
            active,
            completed,
            lazy: false,
            letter: get(curriculumType, 'letter', ''),
            name,
            pieces,
            piecesUnclocked,
            percentageCompleted: (piecesUnclocked * 100) / pieces,
            puzzleChildrenId,
            src: image,
            srcType: this.getSrcType(completed && !active)
          })
        )
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    getSrcType (completed) {
      return completed ? 'src' : 'lazy-src'
    },

    showOverlay (puzzle) {
      this.toShow = { ...puzzle }
      this.dialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-black {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
