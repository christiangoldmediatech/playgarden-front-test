<template>
  <v-row>
    <v-card width="100%">
      <v-card-title>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              class="clickable account-btn mx-2"
              :src="lesson.curriculumType.icon"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="text-truncate">
              {{ lesson.curriculumType.description }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="7">
            <line-stack-chart :line-stack-data="watchTime" />
          </v-col>
          <v-col cols="12" md="5">
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-card width="100%" class="analytics-card">
                    <v-card-text>
                      <label class="font-weight-bold title-dashboard">Total views</label>
                      <v-col
                        cols="12"
                        class="text-center"
                      >
                        <label class="font-weight-bold display-3 total-users">{{ totalViews }}</label> <br>
                        <span class="text-dashboard"> Views </span>
                      </v-col>
                    </v-card-text>
                  </v-card>
                </v-row>
                <v-row class="mt-2">
                  <v-card width="100%" class="analytics-card">
                    <v-card-text>
                      <label class="font-weight-bold title-dashboard">Added to Favorites</label>
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-center"
                        >
                          <p>
                            <label class="font-weight-bold display-3 total-users">{{ favorites }}</label> <br> <br>
                            <span class="text-dashboard pb-5"> Times </span>
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-card>
                  <v-card-text>
                    <label class="font-weight-bold title-dashboard">Devices</label>
                    <v-col
                      cols="12"
                      class="text-center"
                    >
                      <pie-chart :pie-data="devices" />
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card mx-2">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Percentage of Views - TBD</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <label class="font-weight-bold display-3 total-users">80 %</label> <br>
                    <span class="text-dashboard"> Views </span>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card mx-2">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Unique views</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <label class="font-weight-bold display-3 total-users">{{ uniqueViews }}</label> <br>
                    <span class="text-dashboard"> Times </span>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card mx-2">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Skipped</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <label class="font-weight-bold display-3 total-users">{{ skippedViews }}</label> <br>
                    <span class="text-dashboard"> Times </span>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card mx-2">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Status</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="status" :height="status.height" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-row>
              <v-card width="100%" class="analytics-card mx-2">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Ages</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="age" :height="pieSize" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row>
              <v-card width="100%" class="analytics-card mx-2">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Gender</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="gender" :height="pieSize" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row>
              <v-card width="100%" class="analytics-card mx-2">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Browser</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="browser" :height="pieSize" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import LineStackChart from '@/components/echart/LineStackChart.vue'
import PieChart from '@/components/echart/PieChart.vue'
export default {
  name: 'GraphicsPanel',

  components: {
    LineStackChart,
    PieChart
  },

  data: vm => ({
    lessonId: vm.$route.query.lessonId
      ? parseInt(vm.$route.query.lessonId)
      : null,
    lesson: {
      curriculumType: {
        name: '',
        description: '',
        letter: '',
        icon: ''
      }
    },
    entityId: null,
    totalViews: 0,
    favorites: 0,
    skippedViews: 0,
    uniqueViews: 0,
    watchTime: {
      xAxios: [],
      data: []
    },
    pieSize: '140px',
    devices: {
      title: '',
      name: '',
      data: [],
      height: '100px'
    },
    status: {
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
    gender: {
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
    }
  }),

  async created () {
    this.$nuxt.$on('send-video', async (video) => {
      this.entityId = video.id
      await this.getAnalytics()
    })
    this.lesson = await this.getLessonById(this.lessonId)
    this.entityId = this.lesson.videos[0].id
    await this.getAnalytics()
  },

  beforeDestroy () {
    this.$nuxt.$off('send-video')
  },

  methods: {
    ...mapActions('admin/dashboard', ['getDashboardAnalytics']),

    ...mapActions('admin/curriculum', ['getLessonById']),

    async getAnalytics () {
      const { totalViews, favorites, device, browser, age, gender, skippedViews, uniqueViews, status, watchTime } = await this.getDashboardAnalytics({ lessonId: this.lessonId, entityId: this.entityId })
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
  max-height: 185px !important;
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
