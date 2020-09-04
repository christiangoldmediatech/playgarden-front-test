<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="ma-1"
      :class="{ clickable: _unblocked, 'grey lighten-2': !_unblocked }"
      :height="141"
      :width="141"
      :elevation="hover ? 9 : 3"
    >
      <div class="align-center d-flex flex-column justify-end fill-height">
        <v-img
          class="flex-shrink-1 flex-grow-0"
          :class="{ 'blank-shape': !_unblocked }"
          contain
          max-height="80"
          max-width="80"
          :src="letter.icon"
        />

        <span
          class="d-block accent--text text-center font-weight-bold text-h6"
          :class="{ 'white--text': !_unblocked }"
        >
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
    },

    unblocked: {
      type: Object,
      required: true
    }
  },

  computed: {
    _unblocked () {
      return this.unblocked && this.unblocked[this.letter.id]
    }
  }
}
</script>
