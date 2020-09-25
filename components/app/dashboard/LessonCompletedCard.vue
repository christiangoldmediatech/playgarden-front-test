<template>
  <v-card class="d-flex flex-column" height="100%">
    <v-img
      :src="require('@/assets/jpg/worksheets_completed_2.jpg')"
      class="align-center white--text"
      gradient="to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 80%"
    >
      <v-row justify="center">
        <v-col class="text-center" cols="12">
          <underlined-title
            class="text-h3 font-weight-medium white--text"
            text="Congratulations!"
          />
        </v-col>
        <v-col class="py-0" cols="12">
          <p class="text-center white--text">
            You have completed all the tasks for the day.<br>Come back tomorrow for more.
          </p>
        </v-col>
        <v-btn
          class="mt-8"
          color="accent"
          elevation="0"
          :disabled="!disabled"
          rounded
          x-large
          @click.stop="onClick"
        >
          <v-icon large left>
            mdi-play
          </v-icon>
          Go to activities
        </v-btn>
      </v-row>
    </v-img>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LessonCompletedCard',

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    disabled () {
      return (this.getLesson && this.getLesson.lessonsActivities.length)
    }
  },

  methods: {
    onClick () {
      this.$router.push({
        name: 'app-dashboard-lesson-activities',
        query: { id: this.getLesson.lessonsActivities[0].activity.id }
      })
    }
  }
}
</script>
