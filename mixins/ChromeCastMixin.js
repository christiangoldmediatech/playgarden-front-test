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
          // url = 'https://d111phhthppitx.cloudfront.net/out/v1/b1940d391d7c476aa03c77d7e76d1c86/1b56e7ba94b6449393af1bcf0e6f439c/0a550f87dac44f4cb8fd401ed45ca455/index.m3u8'
          type = sources[0].type
        } else {
          url = sources.src
          type = sources.type
        }

        const castSession = cast.framework.CastContext.getInstance().getCurrentSession()

        const mediaInfo = new chrome.cast.media.MediaInfo()
        mediaInfo.contentId = ''
        mediaInfo.contentUrl = url
        // mediaInfo.hlsSegmentFormat = 'ts'
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
