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
              <label>WorkSheet - ONLINE</label>
              <item-grade v-for="(worksheet, i) in lesson.worksheets.filter(data => data.type === 'ONLINE')" :key="`video-grade-${i}`" :data-grade="worksheet" entity-type="Worksheets" />
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row class="pt-8">
          <v-card width="100%">
            <v-card-title>WorkSheets - OFFLINE</v-card-title>
            <v-card-text>
              <label>WorkSheet</label>
              <div v-for="(worksheet, i) in worksheetOffLine" :key="`worksheet-offline-grade-${i}`">
                <item-grade :data-grade="worksheet" :entity-type="worksheet.entity" />
              </div>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-card-actions>
        <v-spacer />

        <v-btn
          class="white--text"
          color="green"
          :loading="loading"
          :text="$vuetify.breakpoint.smAndUp"
          @click.stop="save"
        >
          Save
        </v-btn>
      </v-card-actions>
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
    grades: [],
    worksheetOffLine: [],
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
      this.lesson.worksheets.filter(data => data.type === 'OFFLINE').map((worksheet) => {
        if (worksheet.videoDetail) {
          const worksheeVideo = {
            code: worksheet.code,
            name: worksheet.name,
            entity: 'Videos',
            id: worksheet.videoDetail.id
          }
          this.worksheetOffLine.push(worksheeVideo)
        }

        /* if (worksheet.videoDetail) {
          const worksheeVideo = {
            code: worksheet.code
            name: worksheet.name
            id: worksheet.videoDetail.id
          }
          this.worksheetOffLine.push(worksheeVideo)
        } */
      })
      console.log('lesson--', this.lesson)
    }
  },

  methods: {
    ...mapActions('admin/curriculum', [
      'getLessonById'
    ]),

    ...mapActions('grades', [
      'createArrayGrade'
    ]),

    buildData () {
      this.lesson.lessonsActivities.map((lessonActivity) => {
        const activityData = {
          entityType: 'Activities',
          entityId: lessonActivity.activity.id,
          lessonId: this.lessonId,
          grades: lessonActivity.grades
        }
        this.grades.push(activityData)
      })

      this.lesson.videos.map((video) => {
        const activityData = {
          entityType: 'Videos',
          // entityId: lessonActivity.activityType.id,
          lessonId: this.lessonId,
          grades: video.grades
        }
        this.grades.push(activityData)
      })

      this.lesson.worksheets.filter(data => data.type === 'ONLINE').map((worksheet) => {
        const worksheetData = {
          entityType: 'Worksheets',
          entityId: worksheet.worksheetId,
          lessonId: this.lessonId,
          grades: worksheet.grades
        }
        this.grades.push(worksheetData)
      })
    },

    save () {
      /* try {
        this.loading = true
        console.log('save..!', this.grades)
        await this.createArrayGrade(this.grades)
      } catch (e) {
      } finally {
        this.loading = false
      } */
      this.buildData()
      console.log('save---', this.grades)
    }
  }
}
</script>
