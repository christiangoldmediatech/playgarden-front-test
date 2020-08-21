<template>
  <v-dialog
    id="playerDialog"
    v-model="dialog"
    fullscreen
    persistent
    transition="fade-transition"
  >
    <v-card
      color="black"
      dark
    >
      <!-- <v-card-title id="titleElement">
        {{ title }}
        <v-spacer />
        <v-btn
          icon
          @click.stop="close"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title> -->

      <v-row no-gutters align="center" justify="center">
        <div
          class="videoContainer"
          :style="{'--videoW': `${videoWidth}px`, '--videoH': `${videoHeight}px` }"
        >
          <children-jw-player
            ref="playerRef"
            :playlist="playlist"
            next-up-display
            @playlistComplete="showMessage"
            @ready="setPlayer"
            @play="saveProgress"
            @pause="saveProgress"
            @beforeComplete="completedVideo"
            @hotkey="close"
          />
        </div>
      </v-row>

      <!-- <v-card-actions id="hintElement">
        <v-spacer />
        CTRL + SHIFT + Q to Exit
        <v-spacer />
      </v-card-actions> -->
    </v-card>
    <completed-message
      v-model="completed"
      :buttons="buttons"
      :return-action="returnAction"
      :time-out-action="buttons[0].action"
    >
      <template v-slot:title>
        <span class="title-text white--text text-h3 font-weight-medium">
          Congratulations!
        </span>
      </template>
      <p class="text-h5 text-center font-weight-medium">
        You have completed the daily lessons.
      </p>
    </completed-message>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CompletedMessage from '@/components/app/dashboard/CompletedMessage.vue'

export default {
  name: 'VideoLessonPlayer',

  components: {
    CompletedMessage
  },

  data: () => {
    return {
      dialog: false,
      completed: false,
      title: '',
      playlist: [],
      player: null,
      videoHeight: 0
    }
  },

  computed: {
    ...mapGetters({
      children: 'getCurrentChild'
    }),

    ...mapGetters('admin/curriculum', ['getLesson']),

    videoWidth () {
      if (this.videoHeight > 0) {
        return Math.round(this.videoHeight * (16 / 9))
      }
      return 0
    },

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

  created () {
    this.$nuxt.$on('play-video-lesson', (params) => {
      this.title = params.playlist[0] ? params.playlist[0].name : ''
      if (this.player) {
        this.player.load(params.playlist)
        this.player.play()
      } else {
        this.playlist = params.playlist
      }
      this.open()
    })
  },

  methods: {
    ...mapActions('children/lesson', ['saveVideoProgress']),

    saveProgress () {
      const videoItem = this.player.getPlaylistItem()
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.getPosition()
      this.children.forEach((child) => {
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
      })
    },

    completedVideo () {
      const videoItem = this.player.getPlaylistItem()
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.getPosition()
      this.children.forEach((child) => {
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
      })
    },

    setPlayer () {
      this.player = this.$refs.playerRef.player
      if (this.playlist.length) {
        this.player.play()
      }
    },

    showMessage () {
      this.completed = true
    },

    returnAction () {
      this.close()
    },

    open () {
      this.dialog = true
      this.videoHeight = window.innerHeight - 1
      // this.$nextTick(() => {
      //   const checker = window.setInterval(() => {
      //     const titleElement = document.getElementById('titleElement')
      //     const hintElement = document.getElementById('hintElement')
      //     if (titleElement && hintElement) {
      //       const titleHeight = titleElement.clientHeight
      //       const hintHeight = hintElement.clientHeight
      //       if (titleHeight > 0) {
      //         this.videoHeight = window.innerHeight - titleHeight - hintHeight
      //         window.clearInterval(checker)
      //       }
      //     }
      //   }, 25)
      // })
    },

    close () {
      const status = this.player.getState()
      if (['playing', 'buffering'].includes(status)) {
        this.player.stop()
      }
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.videoContainer {
  width: var(--videoW);
  height: var(--videoH);
}
</style>
