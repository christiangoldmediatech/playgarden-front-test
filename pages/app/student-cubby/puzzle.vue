<template>
  <v-card flat>
    <v-card-text class="text-center">
      <underlined-title class="text-h3" text="Complete the puzzle!" />

      <p class="mt-2">
        Complete each letter in the curriculum to unlock a new puzzle piece!
      </p>

      <v-row justify="center">
        <img
          :src="require('@/assets/png/student-cubby/puzzle.png')"
          width="100%"
        >
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Puzzle'
}
</script>
