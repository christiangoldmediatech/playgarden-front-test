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
      no-auto-track-change
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @last-playlist-item="findNextActivity"
    />
    <patch-earned-dialog v-model="patchEarnedDialog" v-bind="{ player, ...patchData }" />
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
import DashboardMixin from '~/mixins/DashboardMixin'
import { jsonCopy } from '~/utils/objectTools'

export default {
  name: 'LessonActivityPlayer',

  components: {
    VideoPlayerDialog,
    PgVideoJsPlayer
  },

  mixins: [VideoPlayerDialogMixin, DashboardMixin, SaveActivityProgress, ActivityAnalytics, FindNextActivity, DashboardOverrides, Fullscreen],

  data: () => {
    return {}
  },

  computed: {
    noSeek () {
      // if (this.currentVideo && (this.currentVideo.viewed === null || this.currentVideo.viewed.completed === false)) {
      //   return true
      // }
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
        this.saveActivityProgress()
        this.doAnalytics()
        if (this.player.currentTime() === this.player.duration()) {
          this.player.nextVideo()
        }
      })
      player.on('dispose', () => {
        this.player = null
      })
    },

    updateIndex (index) {
      this.doAnalytics(true)
      const nextVideo = jsonCopy(this.playlist[index])
      if (!nextVideo.ignoreVideoProgress || nextVideo.ignoreVideoProgress === false) {
        this.$router.push({
          name: 'app-dashboard-lesson-activities',
          query: { ...this.overrides, id: this.playlist[index].activityId }
        })
      } else if (this.$route.name !== 'app-dashboard-lesson-completed' && this.lessonCompleted) {
        this.$router.push({
          name: 'app-dashboard-lesson-completed'
        })
      }
      this.index = index
    }
  }
}
</script>
