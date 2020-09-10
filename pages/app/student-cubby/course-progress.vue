<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <underlined-title class="text-h3" text="Review all Curriculum" />

        <p class="mt-5">
          Scroll through to review your lessons and worksheets!
        </p>
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
