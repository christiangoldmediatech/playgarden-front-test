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
import { mapActions } from 'vuex'

export default {
  name: 'LetterCard',

  props: {
    letter: {
      type: Object,
      required: true
    }
  },

  computed: {
    studentId () {
      return this.$route.query.id
    },

    _unblocked () {
      return this.letter.enabled
    }
  },

  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),

    async showProgress () {
      if (this._unblocked) {
        const data = await this.getCourseProgressByChildId({
          id: this.studentId,
          curriculumTypeId: this.letter.id
        })

        const lessons = data.map(({ lesson }) => lesson)
        this.$nuxt.$emit('show-curriculum-progress', lessons)
      }
    }
  }
}
</script>
