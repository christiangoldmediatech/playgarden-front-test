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
        <v-col cols="12">
          <puzzle-cover
            :background-image="
              require('@/assets/jpg/student-cubby/puzzle-background.jpg')
            "
            :student-id="studentId"
          />
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-btn
          color="primary"
          nuxt
          :to="{ name: 'app-student-cubby-puzzle-list', query: { id: studentId } }"
        >
          VIEW ALL PUZZLES
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import PuzzleCover from '@/components/app/student-cubby/PuzzleCover'

export default {
  name: 'Index',

  components: {
    PuzzleCover
  },

  computed: {
    studentId () {
      return this.$route.query.id
    }
  }
}
</script>
