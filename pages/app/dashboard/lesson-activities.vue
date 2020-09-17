<template>
  <v-card class="d-flex flex-column" height="100%">
    <template v-if="currentLessonActivity">
      <div
        class="d-flex justify-center align-center clickable dashboard-video-thumbnail flex-grow-1 flex-shrink-0"
        :style="{ '--videoThumbnailUrl': `url(${currentLessonActivity.poster})` }"
        @click.stop="playVideo"
      >
        <v-hover v-slot="{ hover }">
          <div
            :class="['play-icon rounded-circle d-flex flex-column align-center justify-center', { 'scaled-play-icon': hover }]"
          >
            <img
              src="@/assets/svg/play-button.svg"
              class="ml-4 mt-2"
              width="40%"
            >
            <p class="mb-0 font-weight-bold text-uppercase white--text">
              Start
            </p>
          </div>
        </v-hover>
      </div>

      <v-list>
        <v-list-item>
          <v-list-item-avatar tile>
            <v-img
              :src="currentLessonActivity.activityType.icon"
              contain
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold text-uppercase">
              {{ currentLessonActivity.title }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ currentLessonActivity.description }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn
              icon
              large
              :loading="loading"
              @click.stop="setFavorite"
            >
              <v-icon color="#F5737F">
                <template v-if="isFavorite">
                  mdi-heart
                </template>
                <template v-else>
                  mdi-heart-outline
                </template>
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </template>
    <lesson-activity-player activity-mode />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import LessonActivityPlayer from '@/components/app/dashboard/LessonActivityPlayer.vue'
import VideoFavoriteMixin from '@/components/app/activities/VideoFavoriteMixin.js'

export default {
  name: 'LessonActivities',

  components: {
    LessonActivityPlayer
  },

  mixins: [VideoFavoriteMixin],

  data: () => {
    return {
      loading: false
    }
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
            poster: activity.videos.thumbnail,
            lessonActivityId: id,
            activityId: activity.id,
            videoId: activity.videos.id,
            viewed: activity.viewed,
            redirect: true
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
    },

    // TODO: refactor favorites mixin to avoid ugly workarounds
    activity () {
      return {
        id: this.videoId
      }
    }
  },

  created () {
    this.getAllFavorites()
  },

  methods: {
    playVideo () {
      this.$nuxt.$emit('open-lesson-activity-player', { playlist: this.playlist, index: this.currentLessonActivityIndex })
    }
  }
}
</script>

<style lang="scss" scoped>
.play-icon {
  background-color: #F89838;
  width: 150px;
  height: 150px;
  transition: transform 250ms;
}

.scaled-play-icon {
  transform: scale(1.25);
}
</style>