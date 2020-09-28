<template>
  <v-container>
    <v-row align="center">
      <div class="dashboard-child-pick-container">
        <child-select
          :value="value"
          hide-details
          @input="$emit('input', $event)"
        />
      </div>

      <v-spacer />

      <v-btn
        color="primary"
        class="ml-2"
        :small="$vuetify.breakpoint.xs"
        :disabled="videos.length === 0"
        @click.stop="playAll"
      >
        <v-icon left>
          mdi-play
        </v-icon>
        PLAY ALL
      </v-btn>
    </v-row>

    <v-row>
      <video-card
        v-for="item in videos"
        :key="`favorite-video-${item.id}`"
        :video="item.video"
      />
    </v-row>

    <v-row v-if="videos.length === 0">
      <v-col class="text-center">
        <p class="text-h5 font-weight-bold mt-8">
          You haven't favorited any videos yet.
        </p>
      </v-col>
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
    },

    value: {
      validator: (val) => {
        return typeof val === 'number' || val === null
      },
      default: null
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
