<template>
  <v-card>
    <template v-if="currentLessonActivity">
      <v-img
        class="clickable"
        :src="currentLessonActivity.poster"
        :aspect-ratio="16/9"
        @click.stop="playVideo"
      >
        <v-hover v-slot="{ hover }">
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
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
            </v-row>
          </v-container>
        </v-hover>
      </v-img>

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
    <lesson-activity-player />
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
    }
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
