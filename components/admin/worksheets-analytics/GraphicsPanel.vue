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
            <ow-image :image="image" />
          </v-col>
        </v-row>
        <v-row class="content-dashboard">
          <v-col cols="5">
            <v-card>
              <v-card-text>
                <label class="font-weight-bold title-dashboard">Devices</label>
                <v-col
                  cols="12"
                  class="text-center"
                >
                  <pie-chart :pie-data="devices" :height="height" />
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="5">
            <v-card>
              <v-card-text>
                <label class="font-weight-bold title-dashboard">Times done</label>
                <v-col
                  cols="12"
                  class="text-center"
                >
                  <pie-chart :pie-data="devices" :height="height" />
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-row class="content-dashboard">
              <v-col cols="12">
                <v-card class="content-dashboard">
                  <v-card-text>
                    <span class="font-weight-bold">Complete</span><br>
                    <p class="text-center">
                      <label class="display-3 font-weight-bold total-users">0</label>
                      <br>
                      <span>Times</span>
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card class="content-dashboard">
                  <v-card-text>
                    <span class="font-weight-bold">Incomplete</span><br>
                    <p class="text-center">
                      <label class="display-3 font-weight-bold total-users">0</label>
                      <br>
                      <span>Times</span>
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-card>
              <v-card-text>
                <label class="font-weight-bold title-dashboard">Ages</label>
                <v-col
                  cols="12"
                  class="text-center"
                >
                  <pie-chart :pie-data="devices" :height="height" />
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-text>
                <label class="font-weight-bold title-dashboard">Gender</label>
                <v-col
                  cols="12"
                  class="text-center"
                >
                  <pie-chart :pie-data="devices" :height="height" />
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-text>
                <label class="font-weight-bold title-dashboard">Browser</label>
                <v-col
                  cols="12"
                  class="text-center"
                >
                  <pie-chart :pie-data="devices" :height="height" />
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import PieChart from '@/components/echart/PieChart.vue'
import OwImage from './OwImage.vue'
/* import LineStackChart from '@/components/echart/LineStackChart.vue'
import ContentLessonDialog from '@/components/admin/lessons-analytics/ContentLessonDialog.vue' */
export default {
  name: 'GraphicsPanel',

  components: {
    OwImage,
    // LineStackChart,
    PieChart
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
    },
    height: '250px',
    devices: {
      title: '',
      name: '',
      data: [],
      height: '100px'
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
    this.devices.data = [
      { name: 'DESKTOP', value: 16 }
    ]
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
