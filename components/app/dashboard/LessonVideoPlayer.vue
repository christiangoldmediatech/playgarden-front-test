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
      @playlist-complete="showCompletedDialog"
    />
    <!-- Completed dialog -->
    <completed-dialog
      v-model="completed"
      v-bind="completedProps"
    >
      <template v-slot:title>
        <underlined-title
          class="white--text text-h3 font-weight-medium"
          text="Congratulations!"
        />
      </template>

      <p class="text-h5 text-center white--text font-weight-medium">
        You have completed the daily lessons.
      </p>
    </completed-dialog>
  </video-player-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { jsonCopy } from '@/utils/objectTools'
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import SaveVideoProgress from '@/mixins/SaveVideoProgressMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'
import CompletedDialog from '@/components/app/dashboard/CompletedDialog.vue'

export default {
  name: 'LessonVideoPlayer',

  components: {
    VideoPlayerDialog,
    PgVideoJsPlayer,
    CompletedDialog
  },

  mixins: [VideoPlayerDialogMixin, SaveVideoProgress, Fullscreen],

  data: () => {
    return {
      dialog: false,
      completed: false,
      player: null,
      playlist: [],
      index: 0
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),

    currentVideo () {
      return this.playlist[this.index] || null
    },

    noSeek () {
      if (this.currentVideo && this.currentVideo.viewed && this.currentVideo.viewed.completed === false) {
        return true
      }
      return false
    },

    overrides () {
      return {
        childId: this.$route.query.childId,
        lessonId: this.$route.query.lessonId
      }
    },

    buttons () {
      return [
        {
          text: 'COMPLETE WORKSHEETS',
          color: 'accent',
          iconLeft: 'mdi-square-edit-outline',
          action: () => {
            this.$router.push({ name: 'app-dashboard-online-worksheet', query: { ...this.overrides } })
          }
        },
        {
          text: 'SKIP TO ACTIVITIES',
          color: '#FEC572',
          iconLeft: 'mdi-play-outline',
          action: () => {
            // Find first activity
            const activities = this.lesson.lessonsActivities
            if (activities.length) {
              this.$router.push({
                name: 'app-dashboard-lesson-activities',
                query: { ...this.overrides, id: activities[0].id }
              })
            }
          }
        }
      ]
    },

    completedProps () {
      return {
        timeOutAction: () => {
          this.$router.push({ name: 'app-dashboard-online-worksheet', query: { ...this.overrides } })
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
      player.on('ended', this.saveVideoProgress)
      player.on('dispose', () => {
        this.player = null
      })
    },

    updateIndex (index) {
      this.index = index
      this.$router.push({
        name: 'app-dashboard-lesson-videos',
        query: { ...this.overrides, id: this.playlist[index].videoId }
      })
    },

    open ({ playlist, index }) {
      this.dialog = true
      this.playlist = jsonCopy(playlist)
      this.index = index
      // Force fullscreen on small and mobile devices
      if (this.$vuetify.breakpoint.mobile || this.$vuetify.breakpoint.smAndDown) {
        if (!this.fullscreen) {
          this.toggleFullscreen(this.dialogContainerId)
        }
      }
      // Load new media
      this.$nextTick(() => {
        if (!this.player) {
          const waitAndLoad = window.setInterval(() => {
            if (this.player) {
              this.$refs.videoPlayer.loadPlaylist(playlist, index)
              window.clearInterval(waitAndLoad)
            }
          }, 50)
        } else {
          this.$refs.videoPlayer.loadPlaylist(playlist, index)
        }
      })
    },

    showCompletedDialog () {
      this.completed = true
    }
  }
}
</script>
