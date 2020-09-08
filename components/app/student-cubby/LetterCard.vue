<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="ma-1"
      :class="{ clickable: _unblocked, grayscale: !_unblocked }"
      :height="141"
      :width="141"
      :elevation="hover ? 9 : 3"
      @click.stop="showProgress"
    >
      <div class="align-center d-flex flex-column justify-center fill-height">
        <v-img
          class="flex-shrink-1 flex-grow-0"
          contain
          height="80"
          width="80"
          :src="letter.icon"
        />

        <span
          class="d-block accent--text text-center font-weight-bold text-h6"
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
    },

    lessons () {
      if (this._unblocked) {
        return this.unblocked[this.letter.id].map(({ lesson }) => lesson)
      }
      return []
    }
  },

  methods: {
    showProgress () {
      if (this._unblocked) {
        this.$nuxt.$emit('show-curriculum-progress', this.lessons)
      }
    }
  }
}
</script>
