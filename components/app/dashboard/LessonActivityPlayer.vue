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
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @last-playlist-item="findNextActivity"
      @video-skipped="skipLessonActivity"
    />
    <puzzle-piece-earned-dialog v-model="pieceEarnedDialog" v-bind="{ letter, puzzleImg }" @return="handleClose" />
  </video-player-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import DashboardMixin from '@/mixins/DashboardMixin'
import SaveActivityProgress from '@/mixins/SaveActivityProgressMixin.js'
import FindNextActivity from '@/mixins/FindNextActivityMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import { jsonCopy } from '@/utils/objectTools'

import PuzzlePieceEarnedDialog from '@/components/app/PuzzlePieceEarnedDialog.vue'

export default {
  name: 'LessonActivityPlayer',

  components: {
    PuzzlePieceEarnedDialog
  },

  mixins: [VideoPlayerDialogMixin, DashboardMixin, SaveActivityProgress, FindNextActivity, Fullscreen],

  data: () => {
    return {}
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapState('children/lesson', ['puzzlePiece']),

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
        this.player.showLoading()
        this.nextVideo()
        this.player.hideLoading()
      })
      player.on('dispose', () => {
        this.player = null
      })
    },

    async skipLessonActivity () {
      this.player.pause()
      this.player.showLoading()

      if (!this.lesson.previewMode) {
        if (!this.currentVideo.ignoreVideoProgress) {
          await this.completeActivityProgress()
          this.$nuxt.$emit('dashboard-panel-update')
          this.savingActivityProgress = false
        }
      }

      this.player.hideLoading()

      if (this.lastVideo) {
        this.player.seek(this.player.duration() - 1)
        this.player.play()
      } else {
        this.player.nextVideo()
      }
    },

    nextVideo () {
      if (this.player.currentTime() === this.player.duration() && !this.pieceEarnedDialog) {
        this.player.nextVideo()
      }
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
    }
  }
}
</script>
