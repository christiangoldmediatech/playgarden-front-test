<template>
  <div>
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

    <v-card class="pt-12">
      <div class="card-border-top" />

      <v-card-text class="pt-12">
        <!-- Videos -->
        <v-row class="my-2" no-gutters>
          <v-col cols="2">
            <v-row
              align="center"
              class="chip mb-2"
              :class="videosCompletionRate ? 'primary' : 'grey'"
              justify="center"
            >
              <span>1</span>
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
                    :class="{ 'grayscale': checkVideoDisabled(indexV) }"
                    :src="video.activityType.icon"
                    contain
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
        <v-row class="my-2" no-gutters>
          <v-col cols="2">
            <v-row
              align="center"
              class="chip mb-2"
              :class="worksheetsCompletionRate ? 'primary' : 'grey'"
              justify="center"
            >
              <span>2</span>
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
                  class="ma-0"
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
              <component
                :is="videosCompletionRate < 100 ? 'span' : 'nuxt-link'"
                class="black--link font-weight-bold"
                :to="{ name: 'app-dashboard-offline-worksheet' }"
              >
                HANDS-ON LEARNING
              </component>
            </div>
          </v-col>
        </v-row>

        <!-- Activities -->
        <v-row class="my-2" no-gutters>
          <v-col cols="2">
            <v-row
              align="center"
              class="chip mb-2"
              :class="activitiesCompletionRate ? 'primary' : 'grey'"
              justify="center"
            >
              <span>3</span>
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
                :disabled="videosCompletionRate < 100 || checkVideoDisabled(indexA, 'activities')"
                nuxt
                exact
                :to="{
                  name: 'app-dashboard-lesson-activities',
                  query: { id: activity.id }
                }"
              >
                <v-list-item-avatar tile>
                  <v-img
                    :class="{ 'grayscale': videosCompletionRate < 100 || checkVideoDisabled(indexA, 'activities') }"
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
      </v-card-text>
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

      return 0
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
.letter-day {
  &-row {
    height: 55px;
  }

  &-circle {
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

.grayscale {
  -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
  filter: grayscale(100%);
}
</style>
