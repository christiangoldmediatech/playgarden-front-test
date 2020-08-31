<template>
  <v-card>
    <template v-if="currentVideoLesson">
      <v-img
        class="clickable"
        :src="currentVideoLesson.poster"
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

      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione dolorem dolorum voluptatibus incidunt. Accusantium quae numquam cumque. Natus recusandae debitis fugiat possimus ducimus ad repellendus, fuga, error expedita ipsam sit?
      </v-card-text>
    </template>
    <video-player-dialog />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import VideoPlayerDialog from '@/components/VideoPlayerDialog.vue'

export default {
  name: 'VideoLesson',

  components: {
    VideoPlayerDialog
  },

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

    videos () {
      return this.getLesson ? this.getLesson.videos : []
    },

    playlist () {
      return this.videos.map(({ name, description, videoUrl, thumbnail, id, viewed }) => {
        return {
          title: name,
          description,
          src: {
            src: videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
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
      this.$nuxt.$emit('open-video-dialog', { playlist: this.playlist, index: this.currentVideoLessonIndex })
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
