<template>
  <div :class="{ 'dashboard-content-card': $vuetify.breakpoint.mdAndUp }">
    <v-card class="d-flex flex-column dashboard-content-card" height="100%">
      <template v-if="currentLessonActivity">
        <div
          class="d-flex justify-center align-center clickable dashboard-video-thumbnail flex-grow-1 flex-shrink-0"
          :style="{ '--videoThumbnailUrl': `url(${currentLessonActivity.poster})` }"
          @click.stop="playVideo"
        >
          <v-hover v-slot="{ hover }">
            <img
              :class="['play-icon no-background', { 'scaled-play-icon': hover }]"
              src="@/assets/svg/play-button-icon.svg"
              width="100%"
            >
          </v-hover>
        </div>

        <v-list class="lesson-video-card">
          <v-list-item>
            <v-list-item-avatar tile>
              <v-img
                :src="currentLessonActivity.activityType.icon"
                contain
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <span class="dashboard-item-activity-type">
                  {{ currentLessonActivity.activityType.name }}
                </span>
                <span class="dashboard-item-name">
                  with {{ currentLessonActivity.title }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ currentLessonActivity.description }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <slot />
          </v-list-item>
        </v-list>
      </template>
    </v-card>
    <lesson-puzzle-pieces v-if="$vuetify.breakpoint.smAndDown" activities />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { APP_EVENTS } from '@/models'

import LessonPuzzlePieces from '@/components/app/dashboard/LessonPuzzlePieces.vue'

export default {
  name: 'LessonActivitiesCard',

  components: {
    LessonPuzzlePieces
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    activityId () {
      return parseInt(this.$route.query.id)
    },

    playlist () {
      if (this.getLesson) {
        const validActivities = this.getLesson.lessonsActivities.filter(({ activity }) => {
          return activity.videos.videoUrl
        })

        return validActivities.map(({ id, activity }) => {
          return {
            title: activity.videos.name,
            description: activity.videos.description,
            activityType: activity.activityType,
            curriculumType: activity.curriculumType,
            src: {
              src: activity.videos.videoUrl.HLS,
              type: 'application/x-mpegURL'
            },
            poster: activity.videos.image,
            lessonActivityId: id,
            activityId: activity.id,
            videoId: activity.videos.id,
            viewed: activity.viewed
          }
        })
      }
      return []
    },

    currentLessonActivityIndex () {
      return this.playlist.findIndex(({ activityId }) => activityId === this.activityId)
    },

    currentLessonActivity () {
      if (this.currentLessonActivityIndex >= 0) {
        return this.playlist[this.currentLessonActivityIndex]
      }
      return null
    },

    videoId () {
      return this.currentLessonActivity ? this.currentLessonActivity.id : null
    }
  },

  created () {
    if (this.showFavorites) {
      this.getAllFavorites()
    }
  },

  methods: {
    playVideo () {
      this.$nuxt.$emit(APP_EVENTS.DASHBOARD_ACTIVITY_VIDEO_CLICKED, this.activityId)
      this.$nuxt.$emit('open-lesson-activity-player', { playlist: this.playlist, index: this.currentLessonActivityIndex })
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/lesson-video-card.scss';
</style>
