import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('video', ['sendVideoAnalytics']),

    setupVideoAnalytics (player) {
      // Send started to analytics
      const onPlay = () => {
        const {
          videoId
        } = player.getMediaObject()
        const time = player.currentTime()
        const status =
                                       player.currentTime() > 1
                                         ? 'RESUMED'
                                         : 'STARTED'

        this.sendVideoAnalytics({
          videoId,
          time,
          status
        })
      }

      // Send paused to analytics
      const onPause = () => {
        const {
          videoId
        } = player.getMediaObject()
        const time = player.currentTime()
        const closePaused = player.getClosePaused()
        const status = closePaused
          ? 'CLOSED'
          : 'PAUSED'
        player.resetClosePaused()

        this.sendVideoAnalytics({
          videoId,
          time,
          status
        })
      }

      // Send skipped to analytics
      const onSkipped = () => {
        const {
          videoId
        } = player.getMediaObject()
        const time = player.currentTime()
        const status = 'SKIPPED'

        this.sendVideoAnalytics({
          videoId,
          time,
          status
        })
      }

      // Send completed to analytics
      const onEnded = () => {
        const {
          videoId
        } = player.getMediaObject()
        const time = player.currentTime()
        const status = 'COMPLETED'

        this.sendVideoAnalytics({
          videoId,
          time,
          status
        })
      }

      // Send completed to analytics
      const onClosed = () => {
        const {
          videoId
        } = player.getMediaObject()
        const time = player.currentTime()
        const status = 'CLOSED'

        this.sendVideoAnalytics({
          videoId,
          time,
          status
        })
      }

      // Assign events
      player.on('play', onPlay)
      player.on('pause', onPause)
      player.on('skipped', onSkipped)
      player.on('ended', onEnded)
      player.on('closed', onClosed)
    }
  }
}
