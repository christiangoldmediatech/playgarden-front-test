<template>
  <v-row>
    <v-card width="100%">
      <v-card-title>
        <v-row no-gutters>
          <p>
            <label class="subtitle-text">Online Worksheet:</label> <br>
            <label>{{ (worksheet.name) ? worksheet.name : '' }}</label>
          </p>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row v-if="getImages" class="content-dashboard">
          <v-col v-for="(image, index) in getImages" :key="`image-${index}`" cols="3">
            {{ image }}
            <ow-image />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import OwImage from './OwImage.vue'
/* import LineStackChart from '@/components/echart/LineStackChart.vue'
import PieChart from '@/components/echart/PieChart.vue'
import ContentLessonDialog from '@/components/admin/lessons-analytics/ContentLessonDialog.vue' */
export default {
  name: 'GraphicsPanel',

  components: {
    OwImage
    // LineStackChart,
    // PieChart,
    // ContentLessonDialog
  },

  data: vm => ({
    lessonId: vm.$route.query.worksheetId
      ? parseInt(vm.$route.query.worksheetId)
      : null,
    worksheetId: vm.$route.query.worksheetId
      ? parseInt(vm.$route.query.worksheetId)
      : null,
    lesson: {
      curriculumType: {
        name: '',
        title: '',
        letter: '',
        icon: ''
      }
    }
  }),

  computed: {
    worksheet () {
      if (this.lesson && this.lesson.worksheets) {
        return this.lesson.worksheets.find(({ id }) => id === this.worksheetId)
      }
      return {}
    },
    getImages () {
      if (this.worksheet && this.worksheet.worksheetTable) {
        return this.worksheet.worksheetTable.images
      }
      return []
    }
  },

  async created () {
    this.lesson = await this.getLessonById(this.lessonId)
    console.log('lesson--', this.lesson)
    /* this.video = this.lesson.videos[0]
    await this.getAnalytics() */
  },

  methods: {
    ...mapActions('admin/dashboard', ['getDashboardAnalytics']),

    ...mapActions('admin/curriculum', ['getLessonById']),

    openContenLesson () {
      this.$refs.contentLessonRef.open(null, this.lesson)
    },

    async getAnalytics () {
      /* try {
        const { totalViews, favorites, device, browser, age, gender, skippedViews, uniqueViews, status, watchTime } = await this.getDashboardAnalytics({ lessonId: this.lessonId, entityId: this.video.id })
        this.totalViews = totalViews
        this.favorites = favorites
        this.skippedViews = skippedViews
        this.uniqueViews = uniqueViews
        this.watchTime = {
          xAxis: watchTime.time,
          legend: ['Skipped', 'Closed'],
          data: [
            {
              name: 'Skipped',
              type: 'line',
              stack: 'Skipped',
              data: watchTime.skipped
            },
            {
              name: 'Closed',
              type: 'line',
              stack: 'Closed',
              data: watchTime.closed
            }
          ]
        }
        this.status.data = status
        this.age.data = age
        this.gender.data = gender
        this.browser.data = browser
        this.devices.data = device
      } catch (e) {} */
    }
  }
}
</script>

<style>
ul {
  list-style: none; /* Remove default bullets */
}
ul li::before {
  content: "●";
  font-size: 22px !important;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}

.header-dashboard {
  max-height: 500px !important;
}

.cursor {
  cursor: pointer !important;
}

.text-info-dashboard {
  text-indent: 10px !important;
  line-height: 0.8 !important;
}

.content-dashboard {
  height: 100% !important;
}

.title-dashboard {
  color: #606060 !important;
  font-size: 21px !important;
}

.plan-title-dashboard {
  color: #606060 !important;
  font-size: 17px !important;
}

.analytics-card {
  min-height: 185px !important;
}

.text-dashboard {
  font-size: 12px !important;
}

.name-plan-content {
  min-height: 38px !important;
}

.total-users {
  color: var(--v-accent-base) !important;
}
</style>
