import { mapGetters } from 'vuex'
import ChildrenVideoPlayer from '@/components/children-video-player/ChildrenVideoPlayer.vue'

export default {
  components: {
    ChildrenVideoPlayer
  },

  data: () => {
    return {
      dialog: false,
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

    videoId () {
      return this.mediaObject.videoId || null
    },

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
    }
  },

  created () {
    this.$nuxt.$on(this.eventMessage, ({ playlist, index }) => {
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
    this.$nuxt.$off(this.eventMessage)
    window.removeEventListener('resize', this.getWindowDimensions)
  },

  methods: {
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
      }
      this.player.play()
    }
  }
}
