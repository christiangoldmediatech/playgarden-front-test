<template>
  <video-player-dialog
    :id="dialogContainerId"
    ref="videoPlayerDialog"
    v-model="dialog"
    :player-instance="player"
    :z-index="3500"
    @close="handleClose"
  >
    <pg-video-js-player
      ref="videoPlayer"
      autoplay
      use-standard-poster
      show-cast
      show-restart
      show-steps
      :fullscreen-override="handleFullscreen"
      :show-next-up="false"
      no-auto-track-change
      @ready="onReady"
      @pause="saveProgress"
      @ended="close"
    />
  </video-player-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import VideoAnalyticsMixin from '@/mixins/VideoAnalyticsMixin.js'
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import DashboardMixin from '@/mixins/DashboardMixin'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'

export default {
  name: 'LessonTeacherVideo',

  components: {
    VideoPlayerDialog,
    PgVideoJsPlayer
  },

  mixins: [VideoPlayerDialogMixin, DashboardMixin, Fullscreen, VideoAnalyticsMixin],

  data: () => {
    return {
      isSavingProgress: false
    }
  },

  computed: {
  },

  created () {
    this.$nuxt.$on('open-lesson-teacher-video', (params) => {
      this.open(params)
    })
  },

  methods: {
    ...mapActions('children/lesson', ['saveWorksheetVideoProgress']),

    onReady (player) {
      this.player = player
      this.setupVideoAnalytics(player)
      player.on('dispose', () => {
        this.player = null
      })
    },

    close () {
      this.saveProgress()
      this.handleClose()
      this.dialog = false
    },

    async saveProgress () {
      try {
        // Skip if already saving
        if (this.isSavingProgress) {
          return
        }

        // Get data
        const { videoId } = this.player.getMediaObject()
        const time = this.player.currentTime()
        const duration = this.player.duration()
        const completed = (duration - time) <= 15

        // Start saving
        this.isSavingProgress = true

        await this.saveWorksheetVideoProgress({
          videoId,
          time,
          completed
        })
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.isSavingProgress = false
      }
    }
  }
}
</script>
