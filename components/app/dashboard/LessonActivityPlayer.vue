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
      show-next-up
      show-restart
      show-steps
      :show-favorite="lesson && !lesson.previewMode"
      show-cast
      show-video-skip
      use-standard-poster
      next-puzzle
      :next-unlock-image="puzzlePiece ? puzzlePiece.puzzle.image : null"
      :next-unlock-number="remaining"
      :no-seek="noSeek"
      :fullscreen-override="handleFullscreen"
      no-auto-track-change
      :on-next-up-click="player ? player.skipVideo : undefined"
      @ready="onReady"
      @playlist-index-change="updateIndex"
    />
    <lesson-activities-finished-dialog v-model="showFinished" @next-finished="handleAdvanceClose" />
  </video-player-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import VideoAnalyticsMixin from '@/mixins/VideoAnalyticsMixin.js'
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import DashboardMixin from '@/mixins/DashboardMixin'
import SaveActivityProgress from '@/mixins/SaveActivityProgressMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import { jsonCopy } from '@/utils/objectTools'
import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'

import LessonActivitiesFinishedDialog from '@/components/app/dashboard/LessonActivitiesFinishedDialog.vue'

export default {
  name: 'LessonActivityPlayer',

  components: {
    LessonActivitiesFinishedDialog,
    VideoPlayerDialog,
    PgVideoJsPlayer
  },

  mixins: [VideoPlayerDialogMixin, DashboardMixin, SaveActivityProgress, Fullscreen, VideoAnalyticsMixin],

  data: () => {
    return {
      showFinishedVal: false,
      advanceClosing: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapState('children/lesson', ['puzzlePiece']),

    showFinished: {
      get() {
        return this.dialog && this.showFinishedVal
      },
      set(val) {
        if (this.player) {
          this.player.pause()
        }
        this.showFinishedVal = val
        this.dialog = val
      }
    },

    remaining () {
      if (this.lesson) {
        let count = 0
        this.lesson.lessonsActivities.forEach((lessonActivity) => {
          count += Number(Boolean(lessonActivity.activity && lessonActivity.activity.viewed && lessonActivity.activity.viewed.completed))
        })
        return this.lesson.lessonsActivities.length - count
      }
      return 0
    },

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
    this.$nuxt.$on('open-lesson-activity-player', (params) => {
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

      const callbacks = {
        onBeforePause: () => {
          this.saveActivityProgress()
        },
        onBeforeSkip: () => {
          this.player.pause()
          this.saveActivityProgress(true)
        },
        onSkip: () => {
          if (this.lastVideo) {
            this.player.seek(this.player.duration())
            this.showFinishedVal = true
            this.player.trigger('ended')
          } else {
            this.player.nextVideo()
          }
        },
        onBeforeEnded: () => {
          this.saveActivityProgress()
        },
        onEnded: () => {
          if (!this.lastVideo) {
            this.player.nextVideo()
          } else {
            this.showFinishedVal = true
          }
        },
        onBeforeClosed: () => {
          if (this.advanceClosing) {
            this.advanceClosing = false
          } else {
            this.saveActivityProgress()
          }
        }
      }
      this.setupVideoAnalytics(player, callbacks)

      player.on('dispose', () => {
        this.player = null
      })
    },

    updateIndex (index) {
      if (this.index !== index) {
        const nextVideo = jsonCopy(this.playlist[index])
        const completedRoute = this.generateNuxtRoute('lesson-completed')
        if (!nextVideo.ignoreVideoProgress || nextVideo.ignoreVideoProgress === false) {
          this.$router.push(this.generateNuxtRoute('lesson-activities', { id: this.playlist[index].activityId }))
        } else if (this.$route.name !== completedRoute.name && this.lessonCompleted) {
          this.$router.push(completedRoute)
        }
        this.index = index
      }
    },

    handleAdvanceClose () {
      this.advanceClosing = true
      this.handleClose()
      this.showFinishedVal = false
      this.dialog = false
    }
  }
}
</script>
