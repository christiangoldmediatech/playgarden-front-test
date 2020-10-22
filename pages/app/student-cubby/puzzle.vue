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

      <v-row>
        <v-col>
          <input v-model="seed" type="number" step="10" min="0" max="1000">
          <br>
          <input v-model="rows" type="number" min="1">
          <input v-model="columns" type="number" min="1">
          <br>
          <input v-model="height" type="number" step="10" min="10">
          <input v-model="width" type="number" step="10" min="10">
          <br>
          <input v-model="strokeWidth" type="number" step="0.5" min="0">
          <br>
          <v-color-picker v-model="strokeColor" show-swatches />
        </v-col>
      </v-row>

      <v-row justify="center">
        <puzzle-cover
          :background-image="
            require('@/assets/jpg/student-cubby/puzzle-background.jpg')
          "
          :columns="columns"
          :edges-seed="seed"
          :height="height"
          :rows="rows"
          :student-id="studentId"
          :stroke-color="strokeColor"
          :stroke-width="strokeWidth"
          :width="width"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import PuzzleCover from '@/components/app/student-cubby/PuzzleCover'

export default {
  name: 'Puzzle',

  components: {
    PuzzleCover
  },

  data: () => ({
    strokeColor: 'blue',
    strokeWidth: 0.5,
    width: 160,
    height: 90,
    rows: 4,
    columns: 7,
    seed: 0
  }),

  computed: {
    studentId () {
      return this.$route.query.id
    }
  }
}
</script>
