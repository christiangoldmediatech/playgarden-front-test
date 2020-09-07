import videojs from 'video.js'
import CompletedDialog from '@/components/app/dashboard/CompletedDialog.vue'
import ExitTip from '../controls/ExitTip.vue'
import FavoriteBtn from '../controls/FavoriteBtn.vue'
import BufferingCircle from '../controls/BufferingCircle.vue'
import ControlBar from '../controls/ControlBar.vue'

export default {
  components: {
    CompletedDialog,
    ExitTip,
    BufferingCircle,
    FavoriteBtn,
    ControlBar
  },

  props: {
    width: {
      type: [Number, String],
      required: false,
      default: '100%'
    },

    height: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },

    videoId: {
      required: true,
      validator: (val) => {
        return val === null || typeof val === 'number'
      }
    },

    completedProps: {
      type: Object,
      required: false,
      default: () => {
        return {
          timeOut: false
        }
      }
    }
  },

  data: () => {
    return {
      dialog: false,
      nextUp: {
        image: null,
        title: '',
        description: '',
        show: false
      },
      player: null,
      status: 'IDLE',
      volume: 100,
      muted: false,
      fullscreen: false,
      position: 0,
      duration: 0,
      options: {
        controls: false,
        autoplay: false,
        preload: 'auto',
        aspectRatio: '16:9',
        fluid: true,
        sources: [],
        loadingSpinner: false
      }
    }
  },

  computed: {
    playerContainerId () {
      return `player-container-${this._uid}`
    },

    formatted () {
      return {
        width: (typeof this.width === 'number') ? `${this.width}px` : this.width,
        height: (typeof this.height === 'number') ? `${this.height}px` : this.height
      }
    }
  },

  mounted () {
    this.player = videojs(this.$refs.videoPlayer, this.options, this.onPlayerReady)

    this._keyListener = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        if (this.fullscreen) {
          this.toggleFullscreen()
        }
        this.$emit('hotkey')
      }
    }

    document.addEventListener('keydown', this._keyListener.bind(this))
  },

  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
      this.player = null
    }
    document.removeEventListener('keydown', this._keyListener)
  },

  methods: {
    onPlayerReady () {
      // Setup events
      this.player.on(['loadstart', 'seeking', 'waiting', 'stalled'], () => {
        // console.log('loadstart')
        this.status = 'LOADING'
      })

      this.player.on(['play', 'playing'], () => {
        // console.log('play, playing')
        this.status = 'PLAYING'
      })

      this.player.on('timeupdate', () => {
        // console.log('timeupdate')
        this.status = 'PLAYING'
        this.position = this.player.currentTime()
      })

      this.player.on('volumechange', () => {
        // console.log('volumechange')
        this.volume = this.player.volume()
        if (this.volume === 0) {
          this.muted = true
        } else {
          this.muted = false
        }
      })

      this.player.on('durationchange', () => {
        // console.log('durationchange')
        this.duration = this.player.duration()
      })

      this.player.on(['abort', 'ended', 'pause', 'error', 'canplay', 'canplaythrough', 'stalled', 'suspend'], () => {
        // console.log('abort', 'ended', 'pause', 'error', 'canplay', 'canplaythrough', 'stalled', 'suspend')
        this.status = 'IDLE'
      })

      const listenerKeys = Object.keys(this.$listeners)
      const readyIndex = listenerKeys.findIndex(val => val === 'ready')

      if (readyIndex >= 0) {
        listenerKeys.splice(readyIndex, 1)
      }

      listenerKeys.forEach((key) => {
        this.player.on(key, this.$listeners[key].fns)
      })

      this.$emit('ready', this.player)
    },

    toggleFullscreen () {
      try {
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
          this.fullscreen = false
        } else {
          const videoElement = document.getElementById(this.playerContainerId)
          if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen()
          } else if (videoElement.mozRequestFullScreen) {
            videoElement.mozRequestFullScreen()
          } else if (videoElement.webkitRequestFullscreen) {
            videoElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
          } else if (videoElement.msRequestFullscreen) {
            videoElement.msRequestFullscreen()
          }
          this.fullscreen = true
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },

    showCompletedDialog () {
      this.dialog = true
    }
  }
}
