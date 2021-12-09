<template>
  <v-card flat>
    <!-- TODO: changing the child id in the route refreshes the gallery
         but keeps cards lazy, thus needing to scroll to show their new child content
    -->
    <v-card-text class="text-center">
      <!-- Section Title and Description -->
      <div class="d-flex align-center justify-center">
        <img height="80px" src="@/assets/png/student-cubby/puzzle-piece.png">
        <span class="ml-4 text-h4 text-md-h3">PUZZLE</span>
      </div>
      <div v-if="child" class="my-6 text-md-h6 text-body-1">
        Find all of {{ child.firstName || "Child" }}’s completed puzzles. Share
        them on social media!
      </div>

      <v-row class="mt-6" justify="space-around">
        <v-col
          v-for="(puzzle, indexP) in puzzlesResponse"
          :key="indexP"
          cols="12"
          sm="6"
          lg="4"
          data-test-id="gallery-puzzles"
        >
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card
                class="my-3 mx-auto"
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
                      <v-card
                        v-if="puzzle.active"
                        color="transparent"
                        elevation="0"
                        width="300"
                      >
                        <v-row v-if="puzzle.piecesUnclocked !== puzzle.pieces" justify="center" no-gutters>
                          <span class="font-weight-black white--text">
                            {{ (puzzle.piecesUnclocked) ? puzzle.piecesUnclocked : 0 }}/{{ puzzle.pieces }}
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
                            class="mt-3 text-transform-none btn-puzzle"
                            data-test-id="btn-puzzle"
                            @click="showOverlay(puzzle)"
                          >
                            View Progress
                          </v-btn>
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
                      data-test-id="view-puzzle-gallery-button"
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

<script lang="ts">
import { defineComponent, onMounted, computed, useRoute, useStore, useRouter, watch } from '@nuxtjs/composition-api'
import PuzzlePiecesDialog from '@/components/app/student-cubby/PuzzlePiecesDialog.vue'
import { usePuzzle } from '@/composables/puzzle'
import { useChild, useChildRoute } from '@/composables'
import { PuzzleResponse, TypedStore, Child } from '@/models'
import StudyCubbyItemHeader, { StudentCubbyItemHeaderProps } from '@/components/app/student-cubby/StudyCubbyItemHeader.vue'
import { StudentChubbyItemText } from '@/components/app/student-cubby/types'
import { useStudentCubbyHelpers } from '~/components/app/student-cubby/composables'

const itemText: StudentChubbyItemText = 'PUZZLE'

export default defineComponent({
  name: 'Index',

  components: {
    PuzzlePiecesDialog
  },

  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const { childId: studentId } = useChildRoute({ store, route, router })
    const { puzzlesResponse, getPuzzlesByChildId } = usePuzzle()
    const { children, get } = useChild({ store })

    const child = computed(() => children.value.find((child: Child) => child.id === studentId.value))

    onMounted(async () => {
      await getPuzzlesByChildId(studentId.value || 0)
      await get()
    })

    watch(studentId, async () => {
      await getPuzzlesByChildId(studentId.value || 0)
    })

    return {
      studentId,
      puzzlesResponse,
      children,
      child
    }
  },

  data: () => {
    return {
      dialog: false,
      toShow: {}
    }
  },

  methods: {
    showOverlay (puzzle: PuzzleResponse) {
      this.toShow = { ...puzzle }
      this.dialog = true
    }
  }
})
</script>

<style lang="scss" scoped>
.bg-black {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
