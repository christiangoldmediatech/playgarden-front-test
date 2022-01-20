<template>
  <video-player-dialog
    :id="dialogContainerId"
    ref="videoPlayerDialog"
    v-model="dialog"
    :player-instance="player"
    @close="handleClose"
  >
    <pg-video-js-player
      ref="videoPlayer"
      autoplay
      show-restart
      show-steps
      show-favorite
      show-cast
      use-standard-poster
      :fullscreen-override="handleFullscreen"
      no-auto-track-change
      @ready="onReady"
      @ended="handleClose"
    />
  </video-player-dialog>
</template>

<script>
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import DashboardOverrides from '@/mixins/DashboardOverridesMixin.js'

export default {
  name: 'RecordedClassPlayer',

  mixins: [VideoPlayerDialogMixin, DashboardOverrides, Fullscreen],

  created () {
    this.$nuxt.$on('open-recorded-class-player', (params) => {
      this.open(params)
    })
  },

  methods: {
    onReady (player) {
      this.player = player
      player.on('dispose', () => {
        this.player = null
      })
    }
  }
}
</script>
