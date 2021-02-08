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
      :show-video-skip="index < (playlist.length - 1)"
      use-standard-poster
      :no-seek="noSeek"
      :fullscreen-override="handleFullscreen"
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @playlist-complete="showCompletedDialog"
      @video-skipped="skipLessonVideo"
    />
    <!-- Lesson Completed dialog -->
    <lesson-completed-dialog v-model="completed" @close="close" />
  </video-player-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import DashboardLink from '@/mixins/DashboardLinkMixin.js'
import SaveVideoProgress from '@/mixins/SaveVideoProgressMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import LessonCompletedDialog from '@/components/app/dashboard/LessonCompletedDialog.vue'

export default {
  name: 'LessonVideoPlayer',

  components: {
    LessonCompletedDialog
  },

  mixins: [VideoPlayerDialogMixin, SaveVideoProgress, DashboardLink, Fullscreen],

  data: () => {
    return {
      completed: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),

    noSeek () {
      // if (!['production', 'staging'].includes(process.env.testEnv)) {
      //   return false
      // }
      // if (this.currentVideo && (this.currentVideo.viewed === null || this.currentVideo.viewed.completed === false)) {
      //   return true
      // }
      return false
    },

    buttons () {
      return [
        {
          text: 'COMPLETE WORKSHEETS',
          color: 'accent',
          iconLeft: 'pg-icon-paper-pencil',
          action: () => {
            this.$router.push(this.generateNuxtRoute('online-worksheet'))
          }
        },
        {
          text: 'SKIP TO LIBRARY',
          color: '#FEC572',
          iconLeft: 'pg-icon-play',
          action: () => {
            // Find first activity
            const activities = this.lesson.lessonsActivities.map(({ activity }) => activity)
            if (activities.length) {
              const validActivities = this.lesson.lessonsActivities.filter(({ activity }) => {
                return activity.videos.videoUrl
              })

              const playlist = validActivities.map(({ id, activity }) => {
                return {
                  title: activity.videos.name,
                  description: activity.videos.description,
                  activityType: activity.activityType,
                  curriculumType: activity.curriculumType,
                  src: {
                    src: activity.videos.videoUrl.HLS,
                    type: 'application/x-mpegURL'
                  },
                  poster: activity.videos.thumbnail,
                  lessonActivityId: id,
                  activityId: activity.id,
                  videoId: activity.videos.id,
                  viewed: activity.viewed
                }
              })

              this.$nuxt.$emit('open-lesson-activity-player', { playlist, index: 0 })
              this.$router.push(this.generateNuxtRoute('lesson-activities', { id: activities[0].id }))
            }
          }
        }
      ]
    },

    completedProps () {
      return {
        // timeOut: (this.lesson && this.lesson.previewMode) ? false : 30,
        timeOut: false,
        timeOutAction: () => {
          // Find first activity
          const activities = this.lesson.lessonsActivities.map(({ activity }) => activity)
          if (activities.length) {
            this.$router.push(this.generateNuxtRoute('lesson-activities', { id: activities[0].id }))
          }
        },
        buttons: this.buttons,
        returnAction: () => {
          this.$refs.videoPlayerDialog.close()
        }
      }
    }
  },

  created () {
    this.$nuxt.$on('open-lesson-video-player', (params) => {
      this.open(params)
    })
  },

  methods: {
    onReady (player) {
      this.player = player
      player.on('pause', this.saveVideoProgress)
      player.on('dispose', () => {
        this.player = null
      })
    },

    skipLessonVideo () {
      if (this.lesson.previewMode) {
        this.nextVideo()
        return
      }

      this.player.showLoading()
      this.completeVideoProgress().then(() => {
        this.$nuxt.$emit('dashboard-panel-update')
        this.savingProgress = false
        this.player.nextVideo()
      })
      this.player.pause()
    },

    updateIndex (index) {
      this.index = index
      this.$router.push(this.generateNuxtRoute('lesson-videos', { id: this.playlist[index].videoId }))
    },

    showCompletedDialog () {
      this.completed = true
    },

    close () {
      this.handleClose()
      this.dialog = false
    }
  }
}
</script>
