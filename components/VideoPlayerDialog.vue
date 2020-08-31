<template>
  <v-dialog
    v-model="dialog"
    eager
    dark
    fullscreen
    :persistent="false"
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
        <p class="text-h5 text-center font-weight-medium">
          You have completed the daily lessons.
        </p>
      </children-video-player>
    </div>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ChildrenVideoPlayer from '@/components/video-players/children/ChildrenVideoPlayer.vue'

export default {
  name: 'VideoPlayerDialog',

  components: {
    ChildrenVideoPlayer
  },

  data: () => {
    return {
      dialog: false,
      loading: false,
      player: null,
      playlist: [],
      index: null,
      mediaObject: {},
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', ['getLesson']),

    dimensions () {
      const aspectRatio = 16 / 9
      let width = this.winWidth
      let height = Math.round(this.winWidth / aspectRatio)

      if (height > this.winHeight) {
        width = Math.round(this.winHeight * aspectRatio)
        height = this.winHeight
      }

      return {
        width,
        height
      }
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
    },

    completedProps () {
      return {
        timeOut: false,
        buttons: this.buttons
      }
    }
  },

  created () {
    this.$nuxt.$on('open-video-dialog', ({ playlist, index }) => {
      this.playlist = playlist
      this.index = index
      this.mediaObject = this.playlist[index]
      if (this.player) {
        this.loadAndPlay()
      } else {
        this.waitAndLoad()
      }
      this.open()
    })
  },

  mounted () {
    window.addEventListener('resize', this.getWindowDimensions)
  },

  beforeDestroy () {
    this.dialog = false
    this.$nuxt.$off('open-video-dialog')
    window.removeEventListener('resize', this.getWindowDimensions)
  },

  methods: {
    ...mapActions('children/lesson', ['saveVideoProgress']),

    open () {
      this.dialog = true
    },

    close () {
      if (this.player) {
        this.player.pause()
      }
      this.dialog = false
    },

    getWindowDimensions () {
      this.winWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      this.winHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    },

    waitAndLoad () {
      const interval = window.setInterval(() => {
        if (this.player) {
          this.loadAndPlay(this.mediaObject)
          window.clearInterval(interval)
        }
      }, 50)
    },

    loadAndPlay () {
      this.player.loadMedia(this.mediaObject)
      if (this.mediaObject.viewed && !this.mediaObject.viewed.completed) {
        this.player.currentTime(this.mediaObject.viewed.time)
        if (this.mediaObject.videoId === 2) {
          this.player.currentTime(312)
        }
      }
      this.player.play()
    },

    onReady (player) {
      this.player = player
      // player.on('pause', this.saveProgress)
      // player.on('ended', this.completedVideo)
      player.on('ended', this.completedVideo)
    },

    saveProgress () {
      const videoItem = this.mediaObject
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.currentTime()
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
      // const videoItem = this.mediaObject
      // const date = new Date().toISOString().substr(0, 19)
      // const time = this.player.currentTime()
      // const promises = []
      // this.children.forEach((child) => {
      //   promises.push(
      //     this.saveVideoProgress({
      //       lessonId: this.getLesson.id,
      //       childId: child.id,
      //       video: {
      //         id: videoItem.videoId,
      //         completed: true,
      //         time,
      //         date
      //       }
      //     })
      //   )
      // })
      // Promise.all(promises).then(() => {
      //   this.$nuxt.$emit('dashboard-panel-update')
      // })

      // If not last item, then switch
      if (this.index < (this.playlist.length - 1)) {
        this.index++
        this.mediaObject = this.playlist[this.index]
        this.loadAndPlay()
        this.$router.push({ name: 'app-dashboard-video-lesson', query: { id: this.mediaObject.videoId } })
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
