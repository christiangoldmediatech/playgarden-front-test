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
                <template v-if="favorite">
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
import { mapGetters, mapActions } from 'vuex'
import VideoLessonPlayer from '@/components/app/dashboard/VideoLessonPlayer.vue'
import { jsonCopy } from '@/utils/objectTools'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Id',

  components: {
    VideoLessonPlayer
  },

  data: () => {
    return {
      loading: false,
      favorite: false,
      favoriteIds: []
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),
    ...mapGetters({ children: 'getCurrentChild' }),

    id () {
      return parseInt(this.$route.params.id)
    },

    videos () {
      return this.getLesson ? this.getLesson.videos : []
    },

    playlist () {
      const videos = jsonCopy(this.videos)
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

  mounted () {
    this.loading = true
    const stack = []

    this.children.forEach(({ id }) => {
      stack.push(
        this.getFavorites({
          childrenId: id,
          videoId: this.id
        }).then((data) => {
          if (data.length) {
            data.forEach((row) => {
              this.favoriteIds.push(row.id)
            })
            this.favorite = true
          }
        })
      )
    })

    Promise.all(stack).then(() => {
      this.loading = false
    })
  },

  methods: {
    ...mapActions('video', ['getFavorites', 'addFavorite', 'deleteFavorite']),

    playVideo () {
      if (this.currentLessonVideo) {
        this.$nuxt.$emit('play-video-lesson', {
          playlist: this.playlist
        })
      }
    },

    setFavorite () {
      this.loading = true
      const stack = []

      if (this.favorite === false) {
        this.children.forEach(({ id }) => {
          stack.push(
            this.addFavorite({
              childrenId: id,
              videoId: this.id
            }).then((data) => {
              this.favoriteIds.push(data.id)
            })
          )
        })
      } else {
        this.favoriteIds.forEach((id) => {
          stack.push(
            this.deleteFavorite(id)
          )
        })
        this.favoriteIds = []
      }

      Promise.all(stack).then(() => {
        this.favorite = !this.favorite
        this.loading = false
      })
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
