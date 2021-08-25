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
        <underlined-title data-test-id="all-done-title" class="text-h6 text-md-h4" text="Please start taking the daily lessons to get information on your progress" />
      </center>
      <underlined-title v-else class="text-h6 text-md-h5" text="Please start taking the daily lessons to get information on your progress" />

      <p class="mt-4">
        Our teachers are constantly developing new lessons and we will keep uploading them to the Daily Lesson plan as they become available.
      </p>

      <p>
        Children love repetition. The more they do a lesson, the better they will absorb its content and the more they will enjoy the experience - they love the feeling of knowing what is going to happen.
      </p>

      <p :class="($vuetify.breakpoint.xs) ? 'text-center font-weight-bold' : 'font-weight-bold'">
        Choose a Letter to Rewatch:
      </p>

      <v-row>
        <template v-for="(item, index) in currentLetters">
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
          :to="{ name: 'app-dashboard' }"
        >
          GO DAILY LESOSSONS
        </v-btn>
      </center>
      <v-btn
        v-else
        color="accent"
        :small="$vuetify.breakpoint.xs"
        :to="{ name: 'app-dashboard' }"
      >
        GO DAILY LESOSSONS
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { onMounted, useRoute, useStore } from '@nuxtjs/composition-api'
import { useLetters } from '@/composables/letters'
import Letter from '@/components/app/all-done/Letter.vue'
import CourseProgressOverlay from '@/components/app/student-cubby/CourseProgressOverlay.vue'
import { TypedStore } from '@/models'
export default {
  name: 'NoAdvance',

  components: {
    Letter,
    CourseProgressOverlay
  },

  props: {},

  setup () {
    const store = useStore<TypedStore>()
    const { currentLetters, getLeters, getProgress } = useLetters({ store })

    onMounted(async () => {
      await getLeters()
      await getProgress()
    })

    return {
      currentLetters
    }
  }
}
</script>
