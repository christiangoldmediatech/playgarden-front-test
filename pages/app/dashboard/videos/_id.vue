<template>
  <v-card>
    <template v-if="currentLessonVideo">
      <v-img
        class="clickable"
        :src="currentLessonVideo.image"
        :aspect-ratio="16/9"
        @click.stop="playVideo"
      >
        <v-hover v-slot="{ hover }">
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <div
                :class="['play-icon rounded-circle d-flex flex-column align-center justify-center', { 'scaled': hover }]"
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

      <v-card-text class="pa-1">
        <v-row align="center">
          <v-col class="flex-grow-0 flex-shrink-1 pr-0">
            <v-avatar class="ml-2" size="48">
              <v-img :src="currentLessonVideo.image" />
            </v-avatar>
          </v-col>

          <v-col>
            <v-row no-gutters>
              <v-col cols="12">
                {{ currentLessonVideo.name }}
              </v-col>
              <v-col cols="12">
                {{ currentLessonVideo.text }}
              </v-col>
            </v-row>
          </v-col>

          <v-col class="flex-grow-0 flex-shrink-1">
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
          </v-col>
        </v-row>
      </v-card-text>
    </template>
    <video-lesson-player />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import VideoFavoriteMixin from '@/components/app/activities/VideoFavoriteMixin.js'
import VideoLessonPlayer from '@/components/app/dashboard/VideoLessonPlayer.vue'
import { jsonCopy } from '@/utils/objectTools'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Id',

  components: {
    VideoLessonPlayer
  },

  mixins: [VideoFavoriteMixin],

  data: () => {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    id () {
      return parseInt(this.$route.params.id)
    },

    videoId () {
      return this.id
    },

    videos () {
      return this.getLesson ? this.getLesson.videos : []
    },

    playlist () {
      let videos = jsonCopy(this.videos)
      videos = videos.filter(({ videoUrl }) => videoUrl)
      const index = videos.findIndex(({ id }) => id === this.id)
      if (index >= 0) {
        const list = videos.splice(index, videos.length)
        return list.map(({ name, description, videoUrl, thumbnail, id }) => {
          return {
            name,
            text: description,
            file: videoUrl.HLS,
            image: thumbnail,
            videoId: id
          }
        })
      }
      return []
    },

    currentLessonVideo () {
      return this.playlist[0] || null
    }
  },

  methods: {
    playVideo () {
      if (this.currentLessonVideo) {
        this.$nuxt.$emit('play-video-lesson', {
          playlist: this.playlist
        })
      }
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

.scaled {
  transform: scale(1.25);
}
</style>
