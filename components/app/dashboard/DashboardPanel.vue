<template>
  <div class="d-flex flex-column fill-height">
    <!-- <div class="sticky"> -->
    <v-row class="letter-day-row" justify="center">
      <div class="letter-day-circle white">
        <div class="accent--text font-weight-bold text-center text-h3">
          {{ lesson ? lesson.curriculumType.letter : null }}
        </div>

        <div
          class="accent--text font-weight-bold text-center text-h5 text-uppercase"
        >
          DAY {{ lesson ? lesson.day : null }}
        </div>
      </div>
    </v-row>

    <v-card class="d-flex flex-column flex-grow-1 flex-shrink-0 panel-card">
      <div class="card-border-top" />
      <div class="panel-container px-3" :style="{ '--headerHeight': headerHeight }">
        <!-- Videos -->
        <v-row dense>
          <v-col cols="2">
            <v-row
              class="chip mb-2"
              :class="videosCompletionRate ? 'primary white--text' : 'grey'"
              align="center"
              justify="center"
            >
              <span class="font-weight-bold">1</span>
            </v-row>

            <progress-linear
              class="ml-3"
              :color="videosCompletionRate ? 'primary' : 'grey'"
              :height="`${55 * videos.length}px`"
              rounded
              :value="videosCompletionRate"
              width="10px"
            />
          </v-col>

          <v-col cols="10">
            <span class="font-weight-bold text-h5">
              VIDEO LESSONS
            </span>

            <v-list dense>
              <v-list-item
                v-for="(video, indexV) in videos"
                :key="`video-lesson-index-${indexV}-id-${video.id}`"
                class="px-0"
                :disabled="checkVideoDisabled(indexV)"
                nuxt
                exact
                :to="{
                  name: 'app-dashboard-lesson-videos',
                  query: { id: video.id }
                }"
              >
                <v-list-item-avatar tile>
                  <v-img
                    :class="{ 'dashboard-disabled': checkVideoDisabled(indexV) }"
                    :src="video.activityType.icon"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold text-uppercase">
                    {{ video.name }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ video.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>

        <!-- Worksheets -->
        <v-row dense>
          <v-col cols="2">
            <v-row
              class="chip mb-2"
              :class="worksheetsCompletionRate ? 'primary white--text' : 'grey'"
              align="center"
              justify="center"
            >
              <span class="font-weight-bold">2</span>
            </v-row>

            <progress-linear
              class="ml-3"
              :color="worksheetsCompletionRate ? 'primary' : 'grey'"
              :height="`${worksheetsProgressHeight}px`"
              rounded
              :value="worksheetsCompletionRate"
              width="10px"
            />
          </v-col>

          <v-col cols="10">
            <div class="d-flex align-center justify-start">
              <span class="font-weight-bold text-h5">
                WORKSHEETS
              </span>
              <div class="ml-2">
                <v-img
                  :class="['ma-0', { 'dashboard-disabled': videosCompletionRate < 100 }]"
                  :src="require('@/assets/png/dashboard/worksheets.png')"
                  max-width="32px"
                  max-height="32px"
                  contain
                />
              </div>
            </div>

            <div v-if="worksheets.ONLINE.length" class="mt-3">
              <component
                :is="videosCompletionRate < 100 ? 'span' : 'nuxt-link'"
                class="black--link font-weight-bold"
                :to="{ name: 'app-dashboard-online-worksheet' }"
              >
                ONLINE WORKSHEET
              </component>
            </div>

            <div v-if="worksheets.OFFLINE" class="font-weight-bold mt-3">
              <span class="black--link font-weight-bold">
                HANDS-ON LEARNING
              </span>

              <v-btn
                color="primary"
                small
                block
                :disabled="videosCompletionRate < 100"
                nuxt
                :to="{ name: 'app-dashboard-offline-worksheet' }"
              >
                <v-icon left>
                  mdi-download
                </v-icon>
                Download Worksheet
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Activities -->
        <v-row dense>
          <v-col cols="2">
            <v-row
              class="chip mb-2"
              :class="activitiesCompletionRate ? 'primary white--text' : 'grey'"
              align="center"
              justify="center"
            >
              <span class="font-weight-bold">3</span>
            </v-row>

            <progress-linear
              class="ml-3"
              :color="activitiesCompletionRate ? 'primary' : 'grey'"
              :height="`${55 * activities.length}px`"
              rounded
              :value="activitiesCompletionRate"
              width="10px"
            />
          </v-col>

          <v-col cols="10">
            <span class="font-weight-bold text-h5">
              ACTIVITIES
            </span>

            <v-list dense>
              <v-list-item
                v-for="(activity, indexA) in activities"
                :key="indexA"
                class="px-0"
                :disabled="
                  videosCompletionRate < 100 ||
                    checkVideoDisabled(indexA, 'activities')
                "
                nuxt
                exact
                :to="{
                  name: 'app-dashboard-lesson-activities',
                  query: { id: activity.id }
                }"
              >
                <v-list-item-avatar tile>
                  <v-img
                    :class="{
                      'dashboard-disabled':
                        videosCompletionRate < 100 ||
                        checkVideoDisabled(indexA, 'activities')
                    }"
                    :src="activity.activityType.icon"
                    contain
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold text-uppercase">
                    {{ activity.videos.name }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ activity.activityType.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import DashboardMixin from '@/mixins/Dashboard.js'

export default {
  name: 'DashboardPanel',

  mixins: [DashboardMixin],

  props: {
    lesson: {
      required: false,
      validator: (val) => {
        return val === null || typeof val === 'object'
      },
      default: null
    }
  },

  methods: {
    checkVideoDisabled (index, collection = 'videos') {
      if (index > 0) {
        const video = this[collection][index - 1]
        const completed = video.viewed ? video.viewed.completed : false

        return !completed
      }
      return false
    },

    getNextId (items = []) {
      const { id } = items.find(({ viewed }) => !viewed)
      return id
    },

    async getCurrentLesson (redirect = false) {
      try {
        await this.getCurrentLessonByChildrenId({
          childrenIds: this.childrenIds
        })

        if (redirect) {
          this.redirectDashboard()
        }
      } catch (e) {}
    },

    redirectDashboard () {
      if (this.lesson && this.$route.name === 'app-dashboard') {
        if (this.videosCompletionRate < 100) {
          this.$router.push({
            name: 'app-dashboard-videos-id',
            params: { id: this.getNextId(this.videos) }
          })
        } else if (this.worksheetsCompletionRate < 100) {
          this.$router.push({
            name: 'app-dashboard-online-worksheet',
            query: { id: this.getNextId(this.worksheets.ONLINE) }
          })
        } else if (this.activitiesCompletionRate < 100) {
          this.$router.push({
            name: 'app-dashboard-activity-id',
            params: { id: this.getNextId(this.activities) }
          })
        } else {
          this.$router.push({ name: 'app-dashboard-lesson-completed' })
        }
      } else if (
        this.lesson &&
        this.$route.name === 'app-dashboard-lesson-completed'
      ) {
        if (
          this.videosCompletionRate < 100 ||
          this.worksheetsCompletionRate < 100 ||
          this.activitiesCompletionRate < 100
        ) {
          this.$router.push({ name: 'app-dashboard' })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-card {
  padding-top: 100px;
}

.panel-container {
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 0%;
  height: calc(100vh - 223px - var(--headerHeight));
}

.dashboard-disabled {
  -webkit-filter: opacity(40%); /* Chrome, Safari, Opera */
  filter: opacity(40%);
}

.letter-day {
  &-row {
    height: 79px;
    max-height: 79px;
  }

  &-circle {
    margin-top: 24px;
    border-radius: 50%;
    box-shadow: #dce7b5 0px 0px 0px 8px, #c2daa5 0px 0px 0px 19px;
    height: 120px;
    padding-top: 20px;
    width: 120px;
    z-index: 1;
  }
}

.chip {
  border-radius: 50%;
  color: white;
  height: 35px;
  margin: 0;
  padding: 0;
  width: 35px;
}

.card-border-top {
  background-color: #c2daa5;
  border-radius: 4px;
  height: 18px;
  position: absolute;
  top: 0;
  width: 100%;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 100px;
}
</style>
