<template>
  <video-player-dialog
    :id="dialogContainerId"
    ref="videoPlayerDialog"
    v-model="dialog"
    show-favorite
    :video-id="currentVideo ? currentVideo.videoId : -1"
    @close="handleClose"
  >
    <pg-video-js-player
      ref="videoPlayer"
      autoplay
      show-next-up
      :no-seek="noSeek"
      :fullscreen-override="handleFullscreen"
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @last-playlist-item="findNextActivity"
    />
    <patch-earned-dialog v-model="patchEarnedDialog" :player="player" />
  </video-player-dialog>
</template>

<script>
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import SaveActivityProgress from '@/mixins/SaveActivityProgressMixin.js'
import ActivityAnalytics from '@/mixins/ActivityAnalyticsMixin.js'
import FindNextActivity from '@/mixins/FindNextActivityMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import DashboardOverrides from '@/mixins/DashboardOverridesMixin.js'
import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'
import PatchEarnedDialog from '@/components/app/PatchEarnedDialog.vue'

export default {
  name: 'LessonActivityPlayer',

  components: {
    VideoPlayerDialog,
    PgVideoJsPlayer,
    PatchEarnedDialog
  },

  mixins: [VideoPlayerDialogMixin, SaveActivityProgress, ActivityAnalytics, FindNextActivity, DashboardOverrides, Fullscreen],

  data: () => {
    return {
      patchEarnedDialog: false
    }
  },

  computed: {
    noSeek () {
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
        this.patchEarnedDialog = true
        this.saveActivityProgress()
        this.doAnalytics()
      })
      player.on('dispose', () => {
        this.player = null
      })
    },

    updateIndex (index) {
      if (!this.currentVideo.ignoreVideoProgress) {
        this.index = index
        this.$router.push({
          name: 'app-dashboard-lesson-activities',
          query: { ...this.overrides, id: this.playlist[index].activityId }
        })
      }
    }
  }
}
</script>
