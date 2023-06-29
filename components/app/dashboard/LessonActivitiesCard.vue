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
              :class="['play-icon-v2 no-background', { 'scaled-play-icon': hover }]"
              src="@/assets/svg/play-button-icon-v2.svg"
              width="100%"
            >
          </v-hover>
        </div>

        <v-list class="lesson-video-card">
          <v-list-item>
            <v-list-item-avatar tile>
              <v-img
                :src="currentLessonActivity.meta.activityType.icon"
                contain
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <span class="dashboard-item-activity-type">
                  {{ currentLessonActivity.meta.activityType.name }}
                </span>
                <span class="dashboard-item-name">
                  {{ $t('commonWords.prepositionText') }} {{ currentLessonActivity.title }}
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
    <lesson-puzzle-pieces v-if="$vuetify.breakpoint.smAndDown && puzzlePiece" activities />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { APP_EVENTS } from '@/models'

import LessonPuzzlePieces from '@/components/app/dashboard/LessonPuzzlePieces.vue'

export default {
  name: 'LessonActivitiesCard',

  components: {
    LessonPuzzlePieces
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),
    ...mapState('children/lesson', ['puzzlePiece']),

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
            title: activity.activityType.name,
            description: activity.videos.description,
            poster: activity.videos.image,
            src: {
              url: activity.videos.videoUrl.HLS,
              type: 'application/x-mpegURL'
            },
            meta: {
              videoId: activity.videos.id,
              author: `with ${activity.videos.name}`,
              videoType: 'LESSON ACTIVITIES',
              videoIcon: activity.activityType.icon,
              lessonActivityId: id,
              activityId: activity.id,
              activityType: activity.activityType,
              curriculumType: activity.curriculumType,
              viewed: activity.viewed
            }
          }
        })
      }
      return []
    },

    currentLessonActivityIndex () {
      return this.playlist.findIndex(mediaObject => mediaObject.meta.activityId === this.activityId)
    },

    currentLessonActivity () {
      if (this.currentLessonActivityIndex >= 0) {
        return this.playlist[this.currentLessonActivityIndex]
      }
      return null
    },

    videoId () {
      return this.currentLessonActivity ? this.currentLessonActivity.meta.videoId : null
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
