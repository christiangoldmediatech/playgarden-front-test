<template>
  <v-dialog
    v-model="dialog"
    eager
    dark
    fullscreen
    :persistent="true"
  >
    <div class="d-flex align-center justify-center bkg-black">
      <children-video-player
        ref="childrenVideoPlayer"
        :width="dimensions.width"
        :height="dimensions.height"
        :completed-props="completedProps"
        @hotkey="close"
        @ready="onReady"
      >
        <template v-slot:title>
          <span class="title-text white--text text-h3 font-weight-medium">
            Congratulations!
          </span>
        </template>
        <p class="text-h5 text-center white--text font-weight-medium">
          You have completed the daily lessons.
        </p>
      </children-video-player>
    </div>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import VideoPlayerDialog from '@/mixins/VideoPlayerDialog.js'

export default {
  name: 'LessonVideoPlayer',

  mixins: [VideoPlayerDialog],

  data: () => {
    return {
      eventMessage: 'open-lesson-video-player'
    }
  },

  computed: {
    buttons () {
      return [
        {
          text: 'COMPLETE WORKSHEETS',
          color: 'accent',
          iconLeft: 'mdi-square-edit-outline',
          action: () => {
            this.$router.push({ name: 'app-dashboard-online-worksheet' })
          }
        },
        {
          text: 'SKIP TO ACTIVITIES',
          color: '#FEC572',
          iconLeft: 'mdi-play-outline',
          action: () => {
            // Find first activity
            const activities = this.getLesson.lessonsActivities
            if (activities.length) {
              this.$router.push({
                name: 'app-dashboard-lesson-activities',
                query: { id: activities[0].id }
              })
            }
          }
        }
      ]
    },

    completedProps () {
      return {
        timeOutAction: () => {
          this.$router.push({ name: 'app-dashboard-online-worksheet' })
        },
        buttons: this.buttons,
        returnAction: () => {
          this.dialog = false
        }
      }
    }
  },

  methods: {
    ...mapActions('children/lesson', ['saveVideoProgress']),

    onReady (player) {
      this.player = player
      player.on('pause', this.saveProgress)
      player.on('ended', this.completedVideo)
    },

    saveProgress () {
      const mediaObject = this.mediaObject
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.currentTime()
      const duration = this.player.duration()
      const promises = []

      // Only save progress if the video hasn't been completed and we are ahead of where we last left off
      if (!mediaObject.viewed || (!mediaObject.viewed.completed && mediaObject.viewed.time < time)) {
        this.children.forEach((child) => {
          promises.push(
            this.saveVideoProgress({
              lessonId: this.getLesson.id,
              childId: child.id,
              video: {
                id: mediaObject.videoId,
                completed: ((duration - time) < 3),
                time,
                date
              }
            })
          )
        })
        Promise.all(promises).then(() => {
          this.$nuxt.$emit('dashboard-panel-update')
        })
      }
    },

    completedVideo () {
      if (!this.mediaObject.viewed || !this.mediaObject.viewed.completed) {
        const date = new Date().toISOString().substr(0, 19)
        const time = this.player.currentTime()
        const promises = []

        // Do promises
        this.children.forEach((child) => {
          promises.push(
            this.saveVideoProgress({
              lessonId: this.getLesson.id,
              childId: child.id,
              video: {
                id: this.mediaObject.videoId,
                completed: true,
                time,
                date
              }
            })
          )
        })

        // Do promises
        Promise.all(promises).then(() => {
          this.$nuxt.$emit('dashboard-panel-update')
        })
      }

      // If not last item, then switch
      if (this.index < (this.playlist.length - 1)) {
        this.index++
        this.mediaObject = this.playlist[this.index]
        this.loadAndPlay()
        this.$router.push({ name: 'app-dashboard-lesson-videos', query: { id: this.mediaObject.videoId } })
      } else {
        this.$refs.childrenVideoPlayer.showCompletedDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bkg-black {
  background-color: black;
  width: 100vw;
  height: 100vh;
}
</style>
