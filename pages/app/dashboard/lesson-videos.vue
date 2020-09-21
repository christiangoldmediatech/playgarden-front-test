<template>
  <v-card class="d-flex flex-column" height="100%">
    <template v-if="currentVideoLesson">
      <div
        class="d-flex justify-center align-center clickable dashboard-video-thumbnail flex-grow-1 flex-shrink-0"
        :style="{ '--videoThumbnailUrl': `url(${currentVideoLesson.poster})` }"
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
              :src="currentVideoLesson.activityType.icon"
              contain
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold text-uppercase">
              {{ currentVideoLesson.title }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ currentVideoLesson.description }}
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
    <lesson-video-player />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import FavoritesMixin from '@/mixins/FavoritesMixin.js'
import LessonVideoPlayer from '@/components/app/dashboard/LessonVideoPlayer.vue'

export default {
  name: 'LessonVideos',

  components: {
    LessonVideoPlayer
  },

  mixins: [FavoritesMixin],

  data: () => {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    videoId () {
      return parseInt(this.$route.query.id)
    },

    // TODO: refactor favorites mixin to avoid ugly workarounds
    activity () {
      return {
        id: this.videoId
      }
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
      this.$nuxt.$emit('open-lesson-video-player', { playlist: this.playlist, index: this.currentVideoLessonIndex })
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
