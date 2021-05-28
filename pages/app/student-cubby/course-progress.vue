<template>
  <v-card flat class="pt-0 pt-md-3">
    <v-card-text class="pt-0 pt-md-4">
      <div class="text-center">
        <underlined-title
          class="text-h5 text-md-h3"
          text="Review all Curriculum"
        />

        <p class="mt-2">
          Tap on a letter and scroll through to review all lessons & course work
        </p>
      </div>

      <v-row justify="center">
        <div
          v-for="letter in letters"
          :key="`recorded-letter-${letter.id}`"
          @click="showProgress(letter)"
        >
          <recorded-letter
            :letter="letter"
            :disabled="!letter.enabled"
            :list-mode="!letter.enabled"
          />
        </div>
      </v-row>
    </v-card-text>

    <course-progress-overlay />
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import CourseProgressOverlay from '@/components/app/student-cubby/CourseProgressOverlay.vue'

export default {
  name: 'CourseProgress',

  components: {
    CourseProgressOverlay,
    RecordedLetter
  },

  data: () => {
    return {
      letters: []
    }
  },

  computed: {
    studentId () {
      return this.$route.query.id
    }
  },

  watch: {
    studentId () {
      this.fetchChildProgress()
    }
  },

  created () {
    this.fetchChildProgress()
  },

  beforeDestroy () {
    document.querySelector('html').style.overflowY = 'auto'
  },

  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),

    async fetchChildProgress () {
      const data = await this.getCourseProgressByChildId({
        id: this.studentId
      })
      this.letters = data
    },

    showProgress (letter) {
      if (!letter.enabled) {
        return
      }

      this.$nuxt.$emit('show-curriculum-progress', letter.id)
    }
  }
}
</script>
