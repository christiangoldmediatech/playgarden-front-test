<template>
  <v-row class="mx-6 mt-4" justify="center">
    <v-card width="100%">
      <v-col cols="12">
        <v-row class="mt-8">
          <v-card width="100%">
            <v-card-title>Videos</v-card-title>
            <v-card-text>
              <label>Videos</label>
              <item-grade v-for="(video, i) in lesson.videos" :key="`video-grade-${i}`" :list-report-cards="reportCards" :data-grade="video" entity-type="Videos" />
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row class="mt-8">
          <v-card width="100%">
            <v-card-title>Activities</v-card-title>
            <v-card-text>
              <label>Activities</label>
              <template v-for="(activity, i) in lesson.lessonsActivities">
                <item-grade :key="`activity-grade-${i}`" :data-grade="activity" :list-report-cards="reportCards" entity-type="Activities" />
              </template>
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
              <item-grade v-for="(worksheet, i) in lesson.worksheets.filter(data => data.type === 'ONLINE')" :key="`video-grade-${i}`" :data-grade="worksheet" :list-report-cards="reportCards" entity-type="Worksheets" />
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
                <item-grade :data-grade="worksheet" :list-report-cards="reportCards" :entity-type="worksheet.entityType" />
              </div>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-card-actions>
        <v-spacer />

        <v-btn
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
    reportCards: [],
    gradesList: [],
    worksheetOffLine: [],
    lessonId: vm.$route.query.lessonId
      ? parseInt(vm.$route.query.lessonId)
      : null
  }),

  computed: {},

  async created () {
    this.reportCards = await this.getTypes()
    if (this.lessonId) {
      this.loading = true
      this.lesson = await this.getLessonById(this.lessonId)
      this.loading = false
      this.lesson.worksheets.filter(data => data.type === 'OFFLINE').map((worksheet) => {
        if (worksheet.videoDetail) {
          const worksheeVideo = {
            code: `${this.lesson.code}V1`,
            name: worksheet.name,
            lessonId: this.lesson.id,
            type: 'OFFLINE',
            entityType: 'Videos',
            entityId: worksheet.videoDetail.id
          }
          this.worksheetOffLine.push(worksheeVideo)
        }

        if (worksheet.pdfUrl) {
          const worksheetFile = {
            code: worksheet.code,
            name: worksheet.name,
            lessonId: this.lesson.id,
            type: 'OFFLINE',
            entityType: 'Worksheets',
            entityId: worksheet.id
          }
          this.worksheetOffLine.push(worksheetFile)
        }
      })
    }
  },

  methods: {
    ...mapActions('admin/curriculum', [
      'getLessonById'
    ]),

    ...mapActions('admin/report-card', ['getTypes']),

    ...mapActions('grades', [
      'createArrayGrade'
    ]),

    buildData () {
      this.grades = [...this.worksheetOffLine]
      this.lesson.lessonsActivities.map((lessonActivity) => {
        const activityData = {
          entityType: 'Activities',
          entityId: lessonActivity.activity.id,
          lessonId: this.lesson.id,
          grades: lessonActivity.grades
        }
        this.grades.push(activityData)
      })

      this.lesson.videos.map((video) => {
        const activityData = {
          entityType: 'Videos',
          entityId: video.id,
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

    async save () {
      try {
        this.loading = true
        this.buildData()
        await this.createArrayGrade(this.grades)
        this.$snotify.success('Data save succesfully!', {
          timeout: 6000
        })
        this.$router.push({
          name: 'admin-curriculum-management'
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
