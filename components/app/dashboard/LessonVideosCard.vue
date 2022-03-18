<template>
  <div :class="{ 'dashboard-content-card': $vuetify.breakpoint.mdAndUp }" class="pg-h-3/4">
    <v-card class="d-flex flex-column dashboard-content-card" height="100%">
      <template v-if="currentVideoLesson">
        <div
          class="d-flex justify-center align-center clickable dashboard-video-thumbnail flex-grow-1 flex-shrink-0"
          :style="{ '--videoThumbnailUrl': `url(${currentVideoLesson.poster})` }"
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
                :src="currentVideoLesson.activityType.icon"
                contain
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <span class="dashboard-item-activity-type">
                  {{ currentVideoLesson.activityType.name }}
                </span>
                <span class="dashboard-item-name">
                  with {{ currentVideoLesson.title }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ currentVideoLesson.description }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <slot />
          </v-list-item>
        </v-list>
      </template>
    </v-card>
    <lesson-puzzle-pieces v-if="$vuetify.breakpoint.smAndDown" />
    <lesson-video-player />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { APP_EVENTS } from '@/models'

import LessonVideoPlayer from '@/components/app/dashboard/LessonVideoPlayer.vue'
import LessonPuzzlePieces from '@/components/app/dashboard/LessonPuzzlePieces.vue'

export default {
  name: 'LessonVideosCard',

  components: {
    LessonVideoPlayer,
    LessonPuzzlePieces
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    videoId () {
      return parseInt(this.$route.query.id)
    },

    videos () {
      return this.getLesson ? this.getLesson.videos : []
    },

    playlist () {
      return this.videos.map(({ activityType, name, description, videoUrl, thumbnail, id, viewed }) => {
        return {
          title: name,
          description,
          activityType,
          src: [
            {
              src: videoUrl.HLS,
              type: 'application/x-mpegURL'
            }
          ],
          poster: thumbnail,
          videoId: id,
          viewed
        }
      })
    },

    currentVideoLessonIndex () {
      return this.playlist.findIndex(({ videoId }) => videoId === this.videoId)
    },

    currentVideoLesson () {
      if (this.currentVideoLessonIndex >= 0) {
        return this.playlist[this.currentVideoLessonIndex]
      }
      return null
    }
  },

  methods: {
    playVideo () {
      this.$nuxt.$emit(APP_EVENTS.DASHBOARD_VIDEO_LESSON_VIDEO_CLICKED, this.videoId)
      this.$nuxt.$emit('open-lesson-video-player', { playlist: this.playlist, index: this.currentVideoLessonIndex })
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/lesson-video-card.scss';
</style>
