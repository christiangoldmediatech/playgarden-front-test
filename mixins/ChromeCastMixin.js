import { mapState, mapActions } from 'vuex'

export default {
  props: {
    showCast: {
      type: Boolean,
      required: false,
      default: false
    },

    media: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },

  computed: {
    ...mapState('cast', ['castAvailable', 'castContext']),

    canCast () {
      return this.showCast && this.castAvailable
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    ...mapActions('cast', ['init']),

    onCastBtn () {
      cast.framework.CastContext.getInstance().requestSession().then(() => {
        let url, type
        const sources = this.media.src

        if (Array.isArray(sources)) {
          url = sources[0].src
          // url = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
          type = sources[0].type
        } else {
          url = sources.src
          type = sources.type
        }

        const castSession = cast.framework.CastContext.getInstance().getCurrentSession()

        const mediaInfo = new chrome.cast.media.MediaInfo(url, type)
        mediaInfo.hlsSegmentFormat = 'ts'
        const request = new chrome.cast.media.LoadRequest(mediaInfo)
        castSession.loadMedia(request).then(
          function (session) {
            console.log('Load succeed')
            cast.session = session
          },
          function (errorCode) {
            console.log('Error code: ' + errorCode)
          }
        )
      }, (error) => {
        Promise.reject(error)
      })
    }
  }
}
