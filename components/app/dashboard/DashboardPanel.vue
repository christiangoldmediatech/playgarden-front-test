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
                :key="indexV"
                class="px-0"
                nuxt
                :to="{
                  name: 'app-dashboard-videos-id',
                  params: { id: video.id }
                }"
              >
                <v-list-item-avatar>
                  <v-img
                    :src="video.thumbnail"
                    :gradient="
                      video.viewed
                        ? undefined
                        : 'rgba(128, 128, 128, 0.75), rgba(128, 128, 128, 0.75)'
                    "
                    height="200"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
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
            <!-- TODO: set the color using the complete rate -->
            <v-row
              align="center"
              class="chip mb-2"
              :class="0 ? 'primary' : 'grey'"
              justify="center"
            >
              <span>2</span>
            </v-row>

            <!-- TODO: set the color using the complete rate -->
            <!-- TODO: set value using the complete rate -->
            <progress-linear
              class="ml-3"
              :color="0 ? 'primary' : 'grey'"
              :height="`${worksheetsHeightProgress}px`"
              rounded
              value="0"
              width="10px"
            />
          </v-col>

          <v-col cols="10">
            <span class="font-weight-bold text-h5">
              WORKSHEETS
            </span>

            <div v-if="worksheets.ONLINE.length" class="font-weight-bold mt-3">
              ONLINE WORKSHEET
            </div>

            <v-list dense>
              <v-list-item
                v-for="(worksheet, indexWO) in worksheets.ONLINE"
                :key="indexWO"
                class="px-0"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ worksheet.name }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ worksheet.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <div v-if="worksheets.OFFLINE" class="font-weight-bold mt-3">
              HANDS-ON LEARNING

              <v-btn
                block
                class="mb-3"
                color="primary"
                :href="worksheets.OFFLINE.pdfUrl"
                small
                target="_blank"
              >
                <v-icon left>
                  mdi-download
                </v-icon>

                DOWNLOAD
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Activities -->
        <v-row class="my-2" no-gutters>
          <v-col cols="2">
            <!-- TODO: set the color using the complete rate -->
            <v-row
              align="center"
              class="chip mb-2"
              :class="0 ? 'primary' : 'grey'"
              justify="center"
            >
              <span>3</span>
            </v-row>

            <!-- TODO: set the color using the complete rate -->
            <!-- TODO: set value using the complete rate -->
            <progress-linear
              class="ml-3"
              :color="0 ? 'primary' : 'grey'"
              :height="`${55 * activities.length}px`"
              rounded
              value="0"
              width="10px"
            />
          </v-col>

          <v-col cols="10">
            <span class="font-weight-bold text-h5">
              ACTIVITIES
            </span>

            <v-list dense>
              <v-list-item
                v-for="({ activity }, indexA) in activities"
                :key="indexA"
                class="px-0"
              >
                <v-list-item-avatar>
                  <!-- TODO: set the gradient using the complete rate -->
                  <v-img
                    :src="activity.activityType.icon"
                    :gradient="
                      0
                        ? undefined
                        : 'rgba(128, 128, 128, 0.75), rgba(128, 128, 128, 0.75)'
                    "
                    height="200"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DashboardPanel',

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),

    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),

    activities () {
      return this.lesson ? this.lesson.lessonsActivities || [] : []
    },

    childrenIds () {
      // TODO: return ids array when Juan fix the endpoint
      // return this.currentChild ? this.currentChild.map(({ id }) => id) : []

      return 28
    },

    videos () {
      return this.lesson ? this.lesson.videos || [] : []
    },

    videosCompletionRate () {
      const total = this.videos.length

      if (total) {
        const completed = this.videos
          .map(({ viewed }) => Number(viewed || 0))
          .reduce((a, b) => a + b)

        return completed ? (total / completed) * 100 : 0
      }

      return 0
    },

    worksheets () {
      const worksheets = this.lesson ? this.lesson.worksheets || [] : []
      const result = {
        OFFLINE: null,
        ONLINE: [],
        total: worksheets.length
      }

      worksheets.map((i) => {
        if (i.type === 'ONLINE') {
          result.ONLINE.push(i)
        } else if (i.type === 'OFFLINE') {
          result.OFFLINE = i
        }
      })

      return result
    },

    worksheetsHeightProgress () {
      return (
        55 * this.worksheets.total + (this.worksheets.ONLINE.length ? 50 : 0)
      )
    }
  },

  created () {
    try {
      this.getCurrentLessonByChildrenId({ childrenIds: this.childrenIds })
    } catch (e) {}
  },

  methods: {
    ...mapActions('children/lesson', ['getCurrentLessonByChildrenId'])
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
</style>
