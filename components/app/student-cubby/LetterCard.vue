<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="clickable ma-1"
      :height="141"
      :width="141"
      :elevation="hover ? 9 : 3"
    >
      <div class="d-flex flex-column justify-end fill-height">
        <v-img
          class="flex-shrink-1 flex-grow-0"
          :src="letter.icon"
          contain
        />
        <span class="d-block accent--text text-center font-weight-bold text-h6">
          {{ letter.name }}
        </span>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'LetterCard',

  props: {
    letter: {
      type: Object,
      required: true
    }
  }
}
</script>
