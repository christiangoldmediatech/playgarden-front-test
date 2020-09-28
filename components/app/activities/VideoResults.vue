<template>
  <v-container>
    <v-row v-if="videos.length">
      <v-col>
        <v-btn
          color="primary"
          class="ml-2"
          :small="$vuetify.breakpoint.xs"
          @click.stop="playAll"
        >
          <v-icon left>
            mdi-play
          </v-icon>
          PLAY ALL
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <video-card
        v-for="item in videos"
        :key="`favorite-video-${item.id}`"
        :video="item.video"
      />
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-btn
          color="primary"
          text
          block
          x-large
          @click.stop="$router.push({ name: 'app-activities' })"
        >
          Return to activities
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoCard from './VideoCard.vue'

export default {
  name: 'VideoResults',

  components: {
    VideoCard
  },

  props: {
    videos: {
      type: Array,
      required: true
    }
  },

  data: () => {
    return {}
  },

  methods: {
    playAll () {
      const playlist = this.videos.map(({ video }) => {
        return {
          title: video.name,
          description: video.description,
          activityId: video.activityType ? video.activityType.id : false,
          src: {
            src: video.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          poster: video.thumbnail,
          videoId: video.id,
          viewed: {
            completed: true
          }
        }
      })

      if (playlist.length) {
        this.$nuxt.$emit('open-activity-player', { playlist, index: 0 })
      }
    }
  }
}
</script>
