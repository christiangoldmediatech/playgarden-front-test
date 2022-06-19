<template>
  <video-player-dialog
    :id="dialogContainerId"
    ref="videoPlayerDialog"
    v-model="dialog"
    @close="handleClose"
  >
    <pg-video-js-player
      ref="videoPlayer"
      autoplay
      show-next-up
      show-restart
      show-steps
      show-cast
      use-standard-poster
      :fullscreen-override="handleFullscreen"
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @playlist-complete="handleClose"
    />
  </video-player-dialog>
</template>

<script>
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'

export default {
  name: 'ComingSoonPlayer',

  components: {
    VideoPlayerDialog,
    PgVideoJsPlayer
  },

  mixins: [VideoPlayerDialogMixin, Fullscreen],

  data: () => {
    return {
      playlist: [
        {
          title: 'Community Introduction',
          poster: 'https://img.playgardenonline.com/images/activity-thumbnail/28a4d504-d973-4799-a170-2a7144446ec0.jpeg',
          videoId: 4,
          src: [
            {
              src: 'https://d3dnpqxalhovr4.cloudfront.net/out/v1/a9d44d0eb7064de68709336fdcc5429b/748ec5dbba9f4aa0a2eef8a74fb2c043/68b7491c440d41d4b8b6fb0ae08fe0b4/index.m3u8',
              type: 'application/x-mpegURL'
            }
          ]
        },
        {
          title: 'Introduction to Nature',
          poster: 'https://img.playgardenonline.com/images/activity-thumbnail/0d1727d2-1282-4358-97e6-7a6e4a8f7e9c.jpg',
          videoId: 5,
          src: [
            {
              src: 'https://d3dnpqxalhovr4.cloudfront.net/out/v1/72c3fe11799b4c81add7c462d68ad880/748ec5dbba9f4aa0a2eef8a74fb2c043/68b7491c440d41d4b8b6fb0ae08fe0b4/index.m3u8',
              type: 'application/x-mpegURL'
            }
          ]
        }
      ]
    }
  },

  created () {
    this.$nuxt.$on('open-coming-soon-video-player', () => {
      this.open()
    })
  },

  methods: {
    open () {
      this.dialog = true
      this.index = 0
      // Load new media
      this.$nextTick(() => {
        // Force fullscreen on small and mobile devices
        if (this.$vuetify.breakpoint.mobile || this.$vuetify.breakpoint.smAndDown) {
          if (!this.fullscreen) {
            this.toggleFullscreen(this.dialogContainerId)
          }
        }

        if (!this.player) {
          const waitAndLoad = window.setInterval(() => {
            if (this.player) {
              this.$refs.videoPlayer.loadPlaylist(this.playlist, this.index)
              window.clearInterval(waitAndLoad)
            }
          }, 50)
        } else {
          this.$refs.videoPlayer.loadPlaylist(this.playlist, this.index)
        }
      })
    },

    onReady (player) {
      this.player = player
      player.on('dispose', () => {
        this.player = null
      })
    },

    updateIndex (index) {
      this.index = index
    }
  }
}
</script>
