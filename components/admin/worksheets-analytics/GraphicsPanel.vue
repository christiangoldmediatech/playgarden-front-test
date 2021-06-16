<template>
  <v-row>
    <v-card width="100%">
      <v-card-text>
        <v-row no-gutters>
          <p>
            <label class="subtitle-text">Online Worksheet:</label> <br>
            <label class="font-weight-bold text-h5">{{ (worksheet && worksheet.name) ? worksheet.name : '' }}</label>
          </p>
        </v-row>
      </v-card-text>
      <v-card-text class="mt-10">
        <v-row v-if="getImages" class="content-dashboard">
          <v-col v-for="(image, index) in getImages" :key="`image-${index}`" cols="3">
            <ow-image :image="image" :clicks="getClicks(image)" />
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
                  <pie-chart :pie-data="timesDone" :height="height" />
                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-row no-gutters>
              <v-col cols="12">
                <v-card>
                  <v-card-text>
                    <span class="font-weight-bold">Complete</span><br>
                    <p class="text-center">
                      <label class="display-3 font-weight-bold total-users">{{ completes }}</label>
                      <br>
                      <span>Times</span>
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" class="mt-6">
                <v-card>
                  <v-card-text>
                    <span class="font-weight-bold">Incomplete</span><br>
                    <p class="text-center">
                      <label class="display-3 font-weight-bold total-users">{{ incompletes }}</label>
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
                  <pie-chart :pie-data="age" :height="height" />
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
                  <pie-chart :pie-data="gender" :height="height" />
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
                  <pie-chart :pie-data="browser" :height="height" />
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
export default {
  name: 'GraphicsPanel',

  components: {
    OwImage,
    PieChart
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
    clickImages: [],
    devices: {
      title: '',
      name: '',
      data: [],
      height: '100px'
    },
    timesDone: {
      title: '',
      name: '',
      data: [],
      height: '100px'
    },
    age: {
      title: '',
      name: '',
      data: [],
      height: '100px'
    },
    browser: {
      title: '',
      name: '',
      data: [],
      height: '100px'
    },
    gender: {
      title: '',
      name: '',
      data: [],
      height: '100px'
    },
    completes: 0,
    incompletes: 0
  }),

  computed: {
    worksheet () {
      if (this.lesson && this.lesson.worksheets) {
        return this.lesson.worksheets.find(({ id }) => id === this.worksheetId)
      }
      return { name: '' }
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
    await this.getAnalytics()
  },

  methods: {
    ...mapActions('admin/dashboard', ['getWorksheetDashboardAnalytics']),

    ...mapActions('admin/curriculum', ['getLessonById']),

    cleanData () {
      this.clickImages = []
      this.devices.data = []
      this.timesDone.data = []
      this.age.data = []
      this.browser.data = []
      this.gender.data = []
      this.completes = 0
      this.incompletes = 0
    },

    openContenLesson () {
      this.$refs.contentLessonRef.open(null, this.lesson)
    },

    getClicks (image) {
      const result = this.clickImages.find(item => item.image === image.code.toString())
      return (result) ? result.value : 0
    },

    async getAnalytics () {
      try {
        const { clickImages, devices, timesDone, completes, incompletes, browser, age, gender } = await this.getWorksheetDashboardAnalytics({ lessonId: this.lessonId, entityId: this.worksheetId })
        this.clickImages = clickImages
        this.devices.data = devices
        this.timesDone.data = timesDone
        this.completes = completes
        this.incompletes = incompletes
        this.age.data = age
        this.browser.data = browser
        this.gender.data = gender
      } catch (e) {
        this.cleanData()
      }
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
