<template>
  <v-card flat class="pt-0 pt-md-3">
    <v-card-text class="text-center pt-0 pt-md-3">
      <v-row class="mb-sm-n9" no-gutters>
        <v-btn
          color="accent"
          exact
          nuxt
          text
          :to="{ name: 'app-student-cubby-puzzle', query: { id: studentId } }"
        >
          <v-icon left>
            mdi-less-than
          </v-icon>

          Back
        </v-btn>
      </v-row>

      <underlined-title class="text-h5 text-md-h3" text="Gallery" />

      <p class="mt-2">
        Find all of {{ child.firstName || "Child" }}’s completed puzzles. Share
        them on social media!
      </p>

      <v-row class="mt-6" no-gutters justify="space-around">
        <v-card
          v-for="(puzzle, indexP) in puzzles"
          :key="indexP"
          class="my-3"
          :disabled="!puzzle.completed"
          width="340"
          @click="puzzle.completed ? showOverlay(puzzle) : null"
        >
          <v-img aspect-ratio="1.7" :[puzzle.srcType]="puzzle.src">
            <template v-slot:placeholder>
              <v-overlay absolute :value="true">
                <v-card
                  v-if="puzzle.active"
                  color="transparent"
                  elevation="0"
                  width="300"
                >
                  <v-row justify="center" no-gutters>
                    <span class="font-weight-black white--text">
                      {{ puzzle.piecesUnclocked }}/{{ puzzle.pieces }}
                    </span>

                    <v-progress-linear
                      class="mt-2 white"
                      color="accent"
                      height="15"
                      :value="puzzle.percentageCompleted"
                    />
                  </v-row>
                </v-card>

                <v-icon v-else color="grey" size="100">
                  mdi-lock-outline
                </v-icon>
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
        </v-card>
      </v-row>
    </v-card-text>

    <v-dialog content-class="elevation-0" :value="dialog" persistent>
      <v-container class="justify-center fill-height" fluid>
        <v-col class="px-3 px-lg-0" sm="12" lg="8" xl="10">
          <v-img max-height="80vh" :src="toShow.src">
            <v-row class="fill-height" no-gutters>
              <v-col cols="12">
                <v-row justify="end" no-gutters>
                  <v-btn
                    class="bg-black mb-3 mt-3 mr-5"
                    color="white"
                    icon
                    @click.stop="dialog = false"
                  >
                    <v-icon>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </v-row>

                <v-row justify="end" no-gutters>
                  <pg-social-buttons
                    class="mr-3"
                    mini-variant
                    :url="toShow.src"
                  />
                </v-row>
              </v-col>

              <v-col align-self="end" cols="12">
                <v-row no-gutters>
                  <span
                    class="accent--text-fl bg-black font-weight-bold mb-3 mx-3 pa-3 rounded-pill text-h6 text-sm-h3 text-truncate white--text"
                  >
                    {{ toShow.name }}
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </v-img>
        </v-col>
      </v-container>
    </v-dialog>
  </v-card>
</template>

<script>
import { get } from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'List',

  data: () => ({
    dialog: false,
    puzzles: [],
    toShow: {}
  }),

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
            piecesUnclocked = 0
          }) => ({
            id,
            active,
            completed,
            letter: get(curriculumType, 'letter', ''),
            name,
            pieces,
            piecesUnclocked,
            percentageCompleted: (piecesUnclocked * 100) / pieces,
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
      this.toShow = puzzle
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
