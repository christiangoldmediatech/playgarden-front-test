<template>
  <v-dialog v-model="dialog" persistent max-width="854">
    <v-card>
      <v-card-title>
        {{ title }}

        <v-spacer />

        <v-btn icon @click.stop="close">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <div class="video-player-16-9-container">
        <pg-video-player
          inline
          :control-config="{ favorite: false }"
          @ready="onPlayerReady"
        />
      </div>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue" text @click.stop="close">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import PgVideoPlayer from '@gold-media-tech/pg-video-player'

export default {
  name: 'VideoPreview',

  components: {
    PgVideoPlayer
  },

  data: () => {
    return {
      dialog: false,
      title: '',
      player: null
    }
  },

  created () {
    this.$nuxt.$on('open-video-preview', (video) => {
      this.load(video)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('open-video-preview')
    this.player = null
  },

  methods: {
    onPlayerReady (player) {
      this.player = player
    },

    load (video) {
      this.title = video.name
      const mediaObject = {
        title: video.name,
        poster: video.thumbnail,
        src: {
          url: video.videoUrl.HLS,
          type: 'application/x-mpegURL'
        }
      }

      const interval = window.setInterval(() => {
        if (this.player) {
          this.player.loadPlaylist([mediaObject])
          window.clearInterval(interval)
        }
      }, 50)
      this.open()
    },

    open () {
      this.dialog = true
    },

    close () {
      if (this.player) {
        this.player.pause()
      }
      this.dialog = false
    }
  }
}
</script>
