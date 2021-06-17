<template>
  <div>
    <v-card width="100%">
      <v-card-title>
        <v-row no-gutters>
          <v-col cols="12">
            <v-card flat width="100%">
              <v-card-title>
                <v-list v-if="video.activityType" class="lesson-video-card">
                  <v-list-item>
                    <v-list-item-avatar tile>
                      <v-img
                        :src="video.activityType.icon"
                        contain
                      />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        <span class="dashboard-item-activity-type">
                          {{ video.activityType.name }}
                        </span>
                        <span class="dashboard-item-name">
                          with {{ video.name }}
                        </span>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ video.description }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <slot />
                  </v-list-item>
                </v-list>

                <v-spacer />

                <pg-circle-letter-day
                  v-if="lesson"
                  class="cursor"
                  :size="64"
                  no-auto-position
                  :day="lesson ? lesson.day : null"
                  :letter="lesson ? lesson.curriculumType.letter : null"
                  @click.native="openContenLesson"
                />
                <v-btn
                  color="accent"
                  icon
                  @click="openContenLesson"
                >
                  <v-icon x-large>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row class="content-dashboard">
          <v-col cols="12" md="7" class="px-2">
            <v-card class="mt-3" width="100%">
              <line-stack-chart :line-stack-data="watchTime" :height="lineStackHeight" />
            </v-card>
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
                <v-card class="content-dashboard">
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
                  <label class="font-weight-bold title-dashboard">Percentage of Views</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <label class="font-weight-bold display-3 total-users">{{ percenatgeViews }} %</label> <br>
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
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card mx-2">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Ages</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="age" description-tool-tip="Years" :height="pieSize" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col>
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
          <v-col>
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
  </div>
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

  props: {
    currentVideo: {
      type: Object,
      required: true
    }
  },

  data: vm => ({
    lessonId: vm.$route.query.lessonId
      ? parseInt(vm.$route.query.lessonId)
      : null,
    lesson: {
      curriculumType: {
        name: '',
        title: '',
        letter: '',
        icon: ''
      }
    },
    video: {
      activityType: null
    },
    entityId: null,
    lineStackHeight: '418px',
    totalViews: 0,
    favorites: 0,
    skippedViews: 0,
    percenatgeViews: 0,
    uniqueViews: 0,
    watchTime: {
      xAxios: ['0'],
      data: [0]
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

  watch: {
    async currentVideo (val) {
      if (val) {
        this.video = val
        await this.getAnalytics()
        this.$emit('close')
      }
    }
  },

  async created () {
    this.lesson = await this.getLessonById(this.lessonId)
    if (this.currentVideo) {
      this.video = this.currentVideo
    } else {
      this.video = this.lesson.videos[0]
    }
    await this.getAnalytics()
    this.$emit('close')
  },

  methods: {
    ...mapActions('admin/dashboard', ['getDashboardAnalytics']),

    ...mapActions('admin/curriculum', ['getLessonById']),

    clearValues () {
      this.totalViews = 0
      this.favorites = 0
      this.skippedViews = 0
      this.percenatgeViews = 0
      this.uniqueViews = 0
      this.watchTime = {
        xAxis: ['0'],
        legend: ['Skipped', 'Closed'],
        data: [
          {
            name: 'Skipped',
            type: 'line',
            stack: 'Skipped',
            data: [0]
          },
          {
            name: 'Closed',
            type: 'line',
            stack: 'Closed',
            data: [0]
          }
        ]
      }
      this.devices = {
        title: '',
        name: '',
        data: [],
        height: '100px'
      }
      this.status = {
        title: '',
        name: '',
        data: [],
        height: '100px'
      }
      this.age = {
        title: '',
        name: '',
        data: [],
        height: '100px'
      }
      this.gender = {
        title: '',
        name: '',
        data: [],
        height: '100px'
      }
      this.browser = {
        title: '',
        name: '',
        data: [],
        height: '100px'
      }
    },

    openContenLesson () {
      this.$emit('open', this.lesson)
    },

    getPercentageViews (status) {
      let percentage = 0
      const complete = status.find(item => item.name === 'Complete')
      if (complete) {
        const total = status.map(item => item.value).reduce((a, b) => a + b)
        percentage = ((complete.value * 100) / total).toFixed(0)
      }
      return percentage
    },

    async getAnalytics () {
      try {
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
        if (status) {
          this.percenatgeViews = this.getPercentageViews(status)
        }
        this.age.data = age
        this.gender.data = gender
        this.browser.data = browser
        this.devices.data = device
      } catch (e) {
        this.clearValues()
      }
    }
  }
}
</script>

<style>
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
