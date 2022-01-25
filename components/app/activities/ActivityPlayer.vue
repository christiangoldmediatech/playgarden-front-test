<template>
  <video-player-dialog
    :id="dialogContainerId"
    ref="videoPlayerDialog"
    v-model="dialog"
    :player-instance="player"
    data-test-id="video-player-dialog"
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
      next-patch
      :next-unlock-image="patchImg"
      :next-unlock-number="toUnlock"
      show-video-skip
      use-standard-poster
      :no-seek="noSeek"
      :fullscreen-override="handleFullscreen"
      no-auto-track-change
      :on-next-up-click="player ? player.skipVideo : undefined"
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @last-playlist-item="findNextActivity"
      @video-skipped="skipActivityVideo"
    />
    <patch-earned-dialog v-model="patchEarnedDialog" v-bind="{ player, ...patchData }" @return="handleClose; dialog = false" />
  </video-player-dialog>
</template>

<script>
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import ActivityAnalytics from '@/mixins/ActivityAnalyticsMixin.js'
import FindNextActivity from '@/mixins/FindNextActivityMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import DashboardOverrides from '@/mixins/DashboardOverridesMixin.js'

export default {
  name: 'ActivityPlayer',

  mixins: [VideoPlayerDialogMixin, ActivityAnalytics, FindNextActivity, DashboardOverrides, Fullscreen],

  data: () => ({
    timeTriggeredAnalyticsBlock: false
  }),

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
      this.timeTriggeredAnalyticsBlock = false
      this.patchImg = null
      this.toUnlock = null
      this.open(params)
      this.$nextTick(() => {
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.popControls()
        }
      })
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
            if (this.player.currentTime() === this.player.duration() && (!this.patchEarnedDialog && !this.shouldShowPatchEarnedDialog)) {
              this.player.nextVideo()
            }
          })
        }
      })

      player.on('ended', () => {
        if (this.shouldShowPatchEarnedDialog) {
          this.patchEarnedDialog = true
          this.shouldShowPatchEarnedDialog = false
        }
      })

      player.on('timeupdate', () => {
        if ((player.duration() - player.currentTime()) < 30 && !this.timeTriggeredAnalyticsBlock) {
          this.timeTriggeredAnalyticsBlock = true
          this.doAnalytics()
        }
      })

      player.on('dispose', () => {
        this.player = null
      })
    },

    skipActivityVideo () {
      if (this.analyticsLoading === false) {
        this.player.showLoading()
        this.doAnalytics(false, true).then(() => {
          this.player.hideLoading()
          if (!this.patchEarnedDialog) {
            if (this.lastVideo) {
              this.player.loadPlaylist(this.playlist, 0)
            } else {
              this.player.nextVideo()
            }
          }
        })
        this.player.pause()
      }
    },

    updateIndex (index) {
      this.index = index
      this.timeTriggeredAnalyticsBlock = false
      this.doAnalytics(true)
    }
  }
}
</script>
