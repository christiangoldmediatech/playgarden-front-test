<template>
  <v-card class="d-flex flex-column dashboard-content-card" height="100%">
    <v-img
      :src="require('@/assets/jpg/worksheets_completed_2.jpg')"
      class="align-center white--text"
      gradient="to top, rgba(39, 39, 39, 0.9), rgba(255, 255, 255, 0) 80%"
    >
      <v-row class="mx-0 content dashboard-message-padding mt-16 pt-16" justify="center">
        <v-col class="text-center pb-0" cols="12">
          <underlined-title
            class="white--text"
            font-size="56px"
            font-weight="bold"
            text="Congratulations!"
          />
        </v-col>
        <v-col class="py-0" cols="12">
          <p class="text-h5 text-center white--text font-weight-medium mb-0">
            You have completed all the tasks for the day.<br>Come back tomorrow for more.
          </p>
        </v-col>
        <v-btn
          class="mt-8"
          color="accent"
          elevation="0"
          :disabled="!disabled"
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
