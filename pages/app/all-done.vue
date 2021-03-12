<template>
  <v-row class="pt-12 pb-16">
    <course-progress-overlay />
    <v-col cols="10" md="4">
      <center>
        <v-img v-if="$vuetify.breakpoint.xs" :src="require('@/assets/svg/all-done.svg')" :class="($vuetify.breakpoint.xs) ? 'ml-16' : 'ml-4 mt-4'" max-width="180" />
        <v-img v-else :src="require('@/assets/svg/all-done.svg')" :class="($vuetify.breakpoint.xs) ? 'ml-13' : 'ml-4 mt-4'" />
      </center>
    </v-col>
    <v-col cols="12" md="8" :class="($vuetify.breakpoint.xs) ? 'ml-4 mr-5' : 'pl-3'">
      <center v-if="$vuetify.breakpoint.xs">
        <underlined-title class="text-h6 text-md-h4" text="Congratulations! You have finished all the Daily Lessons!" />
      </center>
      <underlined-title v-else class="text-h6 text-md-h5" text="Congratulations! You have finished all the Daily Lessons!" />
      <p :class="($vuetify.breakpoint.xs) ? 'text-center mt-4 pb-3 font-weight-bold' : 'mt-4 pb-3 font-weight-bold'">
        You are such a fast learner!
      </p>

      <p>
        Our teachers are constantly developing new lessons and we will keep uploading them to the Daily Lesson plan as they become available.
      </p>

      <p>
        Children love repetition. The more they do a lesson, the better they will absorb its content and the more they will enjoy the experience - they love the feeling of knowing what is going to happen.
      </p>

      <p :class="($vuetify.breakpoint.xs) ? 'text-center font-weight-bold' : 'font-weight-bold'">
        Choose a Letter to Rewatch:
      </p>

      <v-row>
        <template v-for="(item, index) in actualLetters">
          <letter :key="index" :item="item" :index="index" />
        </template>
      </v-row>

      <p class="mt-5">
        Go to the Library to pick and rewatch your Favorite teachers and Lessons.
      </p>
      <center v-if="$vuetify.breakpoint.xs">
        <v-btn
          color="accent"
          :small="$vuetify.breakpoint.xs"
          :to="{ name: 'app-library' }"
        >
          GO TO LIBRARY
        </v-btn>
      </center>
      <v-btn
        v-else
        color="accent"
        :small="$vuetify.breakpoint.xs"
        :to="{ name: 'app-library' }"
      >
        GO TO LIBRARY
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Letter from '@/components/app/all-done/Letter.vue'
import CourseProgressOverlay from '@/components/app/student-cubby/CourseProgressOverlay.vue'
export default {
  name: 'AllDone',

  components: {
    Letter,
    CourseProgressOverlay
  },

  props: {},

  data: () => {
    return {
      lettersProgress: []
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { letters: 'types' }),

    ...mapGetters({ currentChild: 'getCurrentChild' }),

    actualLetters () {
      return this.letters.map((letter) => {
        const current = this.lettersProgress.find(l => l.id === letter.id)
        return {
          ...letter,
          ...current
        }
      }).slice(0, 9)
    },

    studentId () {
      return this.currentChild[0].id
    }
  },

  watch: {},

  async created () {
    this.getLetters()
    await this.fetchChildProgress()
  },

  methods: {
    ...mapActions('admin/curriculum', {
      getLetters: 'getTypes'
    }),

    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),

    async fetchChildProgress () {
      let data = await this.getCourseProgressByChildId({
        id: this.studentId
      })
      data = data.map((letter) => {
        const disabled = (letter.enabled) ? !letter.enabled : true
        return { ...letter, disabled }
      })
      this.lettersProgress = data
    }
  }
}
</script>
