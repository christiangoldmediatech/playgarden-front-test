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
      use-standard-poster
      :no-seek="noSeek"
      :fullscreen-override="handleFullscreen"
      @ready="onReady"
      @playlist-index-change="updateIndex"
      @playlist-complete="showCompletedDialog"
    />
    <!-- Completed dialog -->
    <completed-dialog
      v-model="completed"
      v-bind="completedProps"
    >
      <template v-slot:title>
        <underlined-title
          class="white--text"
          font-size="56px"
          font-weight="bold"
          text="Congratulations!"
        />
      </template>

      <p class="text-h5 text-center white--text font-weight-medium mb-0">
        You have completed the daily lessons.
      </p>
    </completed-dialog>
  </video-player-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import DashboardLink from '@/mixins/DashboardLinkMixin.js'
import SaveVideoProgress from '@/mixins/SaveVideoProgressMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
// import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'
// import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'
import CompletedDialog from '@/components/app/dashboard/CompletedDialog.vue'

export default {
  name: 'LessonVideoPlayer',

  components: {
    // VideoPlayerDialog,
    // PgVideoJsPlayer,
    CompletedDialog
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
      if (!['production', 'staging'].includes(process.env.testEnv)) {
        return false
      }
      if (this.currentVideo && (this.currentVideo.viewed === null || this.currentVideo.viewed.completed === false)) {
        return true
      }
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
          text: 'SKIP TO ACTIVITIES',
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

    updateIndex (index) {
      this.index = index
      this.$router.push(this.generateNuxtRoute('lesson-videos', { id: this.playlist[index].videoId }))
    },

    showCompletedDialog () {
      this.completed = true
    }
  }
}
</script>
