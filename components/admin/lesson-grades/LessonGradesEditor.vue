<template>
  <v-row class="mx-6 mt-4" justify="center">
    <v-card width="100%">
      <v-col cols="12">
        <v-row class="mt-8">
          <v-card width="100%">
            <v-card-title>Activities</v-card-title>
            <v-card-text>
              <label>Activities</label>
              <item-grade v-for="(activity, i) in lesson.lessonsActivities" :key="`activity-grade-${i}`" :data-grade="activity" entity-type="Activities" />
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row class="mt-8">
          <v-card width="100%">
            <v-card-title>Videos</v-card-title>
            <v-card-text>
              <label>Videos</label>
              <item-grade v-for="(video, i) in lesson.videos" :key="`video-grade-${i}`" :data-grade="video" entity-type="Videos" />
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row class="pt-8">
          <v-card width="100%">
            <v-card-title>WorkSheets</v-card-title>
            <v-card-text>
              <label>WorkSheet</label>
              <item-grade v-for="(worksheet, i) in lesson.worksheets" :key="`video-grade-${i}`" :data-grade="worksheet" entity-type="Worksheets" />
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </v-card>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import ItemGrade from './ItemGrade'
export default {
  name: 'LessonGradesEditor',

  components: {
    ItemGrade
  },

  data: vm => ({
    loading: false,
    lesson: {
      lessonsActivities: [],
      videos: [],
      worksheets: []
    },
    lessonId: vm.$route.query.lessonId
      ? parseInt(vm.$route.query.lessonId)
      : null
  }),

  computed: {},

  async created () {
    if (this.lessonId) {
      this.loading = true
      this.lesson = await this.getLessonById(this.lessonId)
      this.loading = false
      console.log('lesson--', this.lesson)
    }
  },

  methods: {
    ...mapActions('admin/curriculum', [
      'getLessonById'
    ])
  }
}
</script>
