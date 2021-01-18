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
      show-favorite
      show-cast
      use-standard-poster
      :no-seek="noSeek"
      :fullscreen-override="handleFullscreen"
      no-auto-track-change
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @last-playlist-item="findNextActivity"
    />
    <patch-earned-dialog v-model="patchEarnedDialog" v-bind="{ player, ...patchData }" @return="handleClose" />
  </video-player-dialog>
</template>

<script>
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import ActivityAnalytics from '@/mixins/ActivityAnalyticsMixin.js'
import FindNextActivity from '@/mixins/FindNextActivityMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import DashboardOverrides from '@/mixins/DashboardOverridesMixin.js'
// import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'
// import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'

export default {
  name: 'ActivityPlayer',

  // components: {
  //   VideoPlayerDialog,
  //   PgVideoJsPlayer
  // },

  mixins: [VideoPlayerDialogMixin, ActivityAnalytics, FindNextActivity, DashboardOverrides, Fullscreen],

  computed: {
    noSeek () {
      // if (!['production', 'staging'].includes(process.env.testEnv)) {
      //   return false
      // }
      // if (this.currentVideo && (this.currentVideo.viewed === null || this.currentVideo.viewed.completed === false)) {
      //   return true
      // }
      return false
    }
  },

  created () {
    this.$nuxt.$on('open-activity-player', (params) => {
      this.open(params)
    })
  },

  methods: {
    onReady (player) {
      this.player = player
      player.on('pause', () => {
        if (this.analyticsLoading === false) {
          this.player.showLoading()
          this.doAnalytics().then(() => {
            this.player.hideLoading()
            if (this.player.currentTime() === this.player.duration() && !this.patchEarnedDialog) {
              this.player.nextVideo()
            }
          })
        }
      })
      player.on('dispose', () => {
        this.player = null
      })
    },

    updateIndex (index) {
      this.index = index
      this.doAnalytics(true)
    }
  }
}
</script>
