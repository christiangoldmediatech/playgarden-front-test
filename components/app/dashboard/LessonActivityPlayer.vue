<template>
  <video-player-dialog
    :id="dialogContainerId"
    ref="videoPlayerDialog"
    v-model="dialog"
    :show-favorite="lesson && !lesson.previewMode"
    :video-id="currentVideo ? currentVideo.videoId : -1"
    @close="handleClose"
  >
    <pg-video-js-player
      ref="videoPlayer"
      autoplay
      show-next-up
      show-restart
      show-step-back
      use-standard-poster
      :no-seek="noSeek"
      :fullscreen-override="handleFullscreen"
      no-auto-track-change
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @last-playlist-item="findNextActivity"
    />
    <patch-earned-dialog v-model="patchEarnedDialog" v-bind="{ player, ...patchData }" @return="handleClose" />
    <!-- <puzzle-piece-earned-dialog v-model="pieceEarnedDialog" v-bind="{ letter }" @return="handleClose" /> -->
  </video-player-dialog>
</template>

<script>
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import DashboardMixin from '@/mixins/DashboardMixin'
import SaveActivityProgress from '@/mixins/SaveActivityProgressMixin.js'
import ActivityAnalytics from '@/mixins/ActivityAnalyticsMixin.js'
import FindNextActivity from '@/mixins/FindNextActivityMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'LessonActivityPlayer',

  mixins: [VideoPlayerDialogMixin, DashboardMixin, SaveActivityProgress, ActivityAnalytics, FindNextActivity, Fullscreen],

  data: () => {
    return {}
  },

  computed: {
    noSeek () {
      if (!['production', 'staging'].includes(process.env.testEnv)) {
        return false
      }
      if (this.currentVideo && (this.currentVideo.viewed === null || this.currentVideo.viewed.completed === false)) {
        return true
      }
      return false
    }
  },

  created () {
    this.$nuxt.$on('open-lesson-activity-player', (params) => {
      this.open(params)
    })
  },

  methods: {
    onReady (player) {
      this.player = player
      player.on('pause', () => {
        if (this.lesson.previewMode) {
          this.nextVideo()
          return
        }

        this.saveActivityProgress()
        if (this.analyticsLoading === false) {
          this.player.showLoading()
          this.doAnalytics().then(() => {
            this.player.hideLoading()
            this.nextVideo()
          })
        }
      })
      player.on('dispose', () => {
        this.player = null
      })
    },

    nextVideo () {
      if (this.player.currentTime() === this.player.duration() && !this.patchEarnedDialog && !this.pieceEarnedDialog) {
        this.player.nextVideo()
      }
    },

    updateIndex (index) {
      const nextVideo = jsonCopy(this.playlist[index])
      const completedRoute = this.generateNuxtRoute('lesson-completed')
      if (!nextVideo.ignoreVideoProgress || nextVideo.ignoreVideoProgress === false) {
        this.$router.push(this.generateNuxtRoute('lesson-activities', { id: this.playlist[index].activityId }))
      } else if (this.$route.name !== completedRoute.name && this.lessonCompleted) {
        this.$router.push(completedRoute)
      }
      this.index = index
      if (!this.lesson.previewMode) {
        this.doAnalytics(true)
      }
    }
  }
}
</script>
