<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <!-- Section Title and Description -->
        <div class="d-flex align-center justify-center">
          <img height="80px" src="@/assets/png/student-cubby/abc.png">
          <span class="ml-4 text-h4 text-md-h3">CURRICULUM</span>
        </div>
        <div class="my-6 text-md-h6 text-body-1">
          Scroll through to review your lessons and worksheets!
        </div>
      </div>

      <v-row justify="center">
        <letter-card
          v-for="letter in letters"
          :key="`letter-card-${letter.id}`"
          v-bind="{ letter }"
        />
      </v-row>
    </v-card-text>

    <course-progress-overlay />
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

import LetterCard from '@/components/app/student-cubby/LetterCard.vue'
import CourseProgressOverlay from '@/components/app/student-cubby/CourseProgressOverlay.vue'

export default {
  name: 'CourseProgress',

  components: {
    LetterCard,
    CourseProgressOverlay
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
    }
  }
}
</script>
