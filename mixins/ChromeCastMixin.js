import { mapState, mapActions } from 'vuex'

// const MEDIA_NAMESPACE = 'urn:x-cast:com.google.cast.media'
// let requestId = 1

export default {
  props: {
    showCast: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      isCasting: false,
      castLoading: false
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
        // let url, type
        let url
        const sources = this.mediaObject.src

        if (Array.isArray(sources)) {
          url = sources[0].src
        } else {
          url = sources.src
        }

        const castSession = cast.framework.CastContext.getInstance().getCurrentSession()

        const mediaInfo = new chrome.cast.media.MediaInfo()
        mediaInfo.contentId = ''
        mediaInfo.contentUrl = url

        const request = new chrome.cast.media.LoadRequest(mediaInfo)

        castSession.loadMedia(request).then(
          function () {
            // eslint-disable-next-line
            console.log('Load succeed')
            // cast.session = session
          },
          function (errorCode) {
            // eslint-disable-next-line
            console.log('Error code: ' + errorCode)
          }
        )
      }, (error) => {
        Promise.reject(error)
      })
    }
  }
}
