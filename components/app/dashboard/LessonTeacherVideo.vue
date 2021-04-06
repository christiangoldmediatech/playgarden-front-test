<template>
  <video-player-dialog
    :id="dialogContainerId"
    ref="videoPlayerDialog"
    v-model="dialog"
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
      @ended="close"
    />
  </video-player-dialog>
</template>

<script>
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import DashboardMixin from '@/mixins/DashboardMixin'
import Fullscreen from '@/mixins/FullscreenMixin.js'

export default {
  name: 'LessonTeacherVideo',

  mixins: [VideoPlayerDialogMixin, DashboardMixin, Fullscreen],

  data: () => {
    return {}
  },

  computed: {
  },

  created () {
    this.$nuxt.$on('open-lesson-teacher-video', (params) => {
      this.open(params)
    })
  },

  methods: {
    onReady (player) {
      this.player = player
      player.on('dispose', () => {
        this.player = null
      })
    },

    close () {
      this.handleClose()
      this.dialog = false
    }
  }
}
</script>
