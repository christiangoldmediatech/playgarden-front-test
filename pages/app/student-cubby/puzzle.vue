<template>
  <v-card flat>
    <v-card-text class="text-center">
      <span class="text-h3 title-text">
        Complete the puzzle!
      </span>
      <p class="mt-5">
        Complete each letter in the curriculum to unlock a new puzzle piece!
      </p>

      <v-row justify="center">
        <img :src="require('@/assets/png/student-cubby/puzzle.png')" width="100%">
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Puzzle'
}
</script>
