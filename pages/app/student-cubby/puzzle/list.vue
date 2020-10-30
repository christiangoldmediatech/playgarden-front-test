<template>
  <v-card flat class="pt-0 pt-md-3">
    <v-card-text class="text-center pt-0 pt-md-3">
      <v-row no-gutters>
        <v-btn
          color="accent"
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

      <v-row class="mt-6" no-gutters justify="space-around">
        <v-card
          v-for="(puzzle, indexP) in puzzles"
          :key="indexP"
          class="my-3"
          :disabled="!puzzle.completed"
          width="340"
          @click="puzzle.completed ? showOverlay(puzzle) : null"
        >
          <v-img
            aspect-ratio="1.7"
            contain
            :[getSrcType(puzzle.completed)]="puzzle.src"
          >
            <template v-slot:placeholder>
              <v-overlay absolute :value="true">
                <v-icon color="grey" size="100">
                  mdi-lock-outline
                </v-icon>
              </v-overlay>
            </template>

            <v-row align="end" class="fill-height" justify="end" no-gutters>
              <pg-circle-letter-day
                class="mb-3 mr-3"
                letter="2"
                no-auto-position
                size="50"
              />
            </v-row>
          </v-img>
        </v-card>
      </v-row>
    </v-card-text>

    <v-dialog content-class="elevation-0" :value="dialog" persistent>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" no-gutters>
          <v-col class="px-3 px-lg-0" sm="12" lg="8" xl="10">
            <v-row justify="end">
              <v-btn color="white" icon @click.stop="dialog = false">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-row>

            <v-row align="center" class="portfolio-card">
              <v-col cols="12" md="">
                <img class="w-100" :src="toShow.src">
              </v-col>

              <v-col class="shrink" cols="12" md="">
                <pg-social-buttons class="mx-auto mx-md-0" :url="toShow.src" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: 'List',

  data: () => ({
    dialog: false,
    puzzles: Array(24)
      .fill()
      .map((_, id) => ({
        id,
        completed: id % 2 === 1,
        src: 'https://picsum.photos/510/300?random'
      })),
    toShow: {}
  }),

  computed: {
    studentId () {
      return this.$route.query.id
    }
  },

  methods: {
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
