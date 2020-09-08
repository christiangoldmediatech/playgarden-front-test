import { mapGetters, mapActions } from 'vuex'
import ChildrenVideoPlayer from '@/components/children-video-player/ChildrenVideoPlayer.vue'
import { jsonCopy } from '@/utils/objectTools'

export default {
  components: {
    ChildrenVideoPlayer
  },

  props: {
    activityMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      dialog: false,
      player: null,
      playlist: [],
      showingNextUp: false,
      findingNext: false,
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
      this.playlist = jsonCopy(playlist)
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
    ...mapActions('admin/activity', ['getNextActivity']),

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
          if (this.dialog) {
            this.loadAndPlay(this.mediaObject)
          }
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
    },

    handleNextUp () {
      const position = this.player.currentTime()
      const duration = this.player.duration()
      const { videoId } = this.mediaObject
      const index = this.playlist.findIndex(mediaObject => videoId === mediaObject.videoId)
      const last = index === (this.playlist.length - 1)

      if (this.activityMode && !this.findingNext && last && (duration - position) <= 10) {
        this.findNextActivity()
      }

      if (index >= 0 && !last && (duration - position) <= 5 && !this.showingNextUp) {
        this.showingNextUp = true
        const next = this.playlist[index + 1]
        this.$refs.childrenVideoPlayer.showNextUp({
          image: next.poster,
          title: next.title,
          description: next.description
        }).then(() => {
          this.showingNextUp = false
        })
      }
    },

    findNextActivity () {
      // Find random video
      this.findingNext = true
      const curriculumTypeId = this.mediaObject.curriculumType ? this.mediaObject.curriculumType.id : undefined

      this.getNextActivity({
        prevActivityId: this.mediaObject.activityId,
        params: {
          curriculumTypeId
        }
      }).then(({ id, activityType, curriculumType, videos }) => {
        this.playlist.push({
          title: videos.name,
          description: videos.name,
          activityId: id,
          activityType,
          curriculumType,
          src: {
            src: videos.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          poster: videos.thumbnail,
          videoId: videos.id,
          viewed: {
            completed: true
          }
        })
      }).then(() => {
        this.findingNext = false
      })
    }
  }
}
