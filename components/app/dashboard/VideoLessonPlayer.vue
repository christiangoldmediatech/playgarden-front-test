<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    transition="fade-transition"
  >
    <v-card
      color="black"
      dark
    >
      <v-row no-gutters align="center" justify="center">
        <div
          class="video-container"
          :style="{'--videoW': `${videoWidth}px`, '--videoH': `${videoHeight}px` }"
        >
          <children-jw-player
            ref="playerRef"
            :playlist="playlist"
            :videoId="videoId"
            @playlistComplete="showMessage"
            @ready="setPlayer"
            @viewable="startPlaying"
            @pause="saveProgress"
            @beforeComplete="completedVideo"
            @hotkey="close"
          />
        </div>
      </v-row>
    </v-card>
    <completed-dialog
      v-model="completed"
      :time-out="15"
      :buttons="buttons"
      :return-action="returnAction"
      :time-out-action="buttons[0].action"
    >
      <template v-slot:title>
        <span class="title-text white--text text-h3 font-weight-medium">
          Congratulations!
        </span>
      </template>
      <p class="text-h5 text-center font-weight-medium white--text">
        You have completed the daily lessons.
      </p>
    </completed-dialog>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VideoPlayerMixin from '@/mixins/VideoPlayer.js'
import CompletedDialog from '@/components/app/dashboard/CompletedDialog.vue'

export default {
  name: 'VideoLessonPlayer',

  components: {
    CompletedDialog
  },

  mixins: [VideoPlayerMixin],

  data: () => {
    return {
      completed: false,
      eventName: 'play-video-lesson'
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

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
            this.$router.push({ name: 'app-activities' })
          }
        }
      ]
    }
  },

  methods: {
    ...mapActions('children/lesson', ['saveVideoProgress']),

    saveProgress () {
      const videoItem = this.player.getPlaylistItem()
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.getPosition()
      if (
        !videoItem.viewed ||
        (videoItem.viewed && !videoItem.viewed.completed && videoItem.viewed.time < time)
      ) {
        const promises = []
        this.children.forEach((child) => {
          promises.push(
            this.saveVideoProgress({
              lessonId: this.getLesson.id,
              childId: child.id,
              video: {
                id: videoItem.videoId,
                completed: false,
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
      const videoItem = this.player.getPlaylistItem()
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.getPosition()
      const promises = []
      this.children.forEach((child) => {
        promises.push(
          this.saveVideoProgress({
            lessonId: this.getLesson.id,
            childId: child.id,
            video: {
              id: videoItem.videoId,
              completed: true,
              time,
              date
            }
          })
        )
      })
      Promise.all(promises).then(() => {
        this.$nuxt.$emit('dashboard-panel-update')
      })

      // If not last item, then switch
      const videoIndex = this.player.getPlaylistIndex()
      const playlist = this.player.getPlaylist()
      if (videoIndex < (playlist.length - 1)) {
        const nextItem = playlist[videoIndex + 1]
        this.$router.push({ name: 'app-dashboard-video-id', params: { id: nextItem.videoId } })
      }
    },

    showMessage () {
      this.completed = true
    },

    returnAction () {
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  width: var(--videoW) !important;
  height: var(--videoH) !important;
}
</style>
