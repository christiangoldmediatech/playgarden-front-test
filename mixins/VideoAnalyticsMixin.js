import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('video', ['sendVideoAnalytics']),

    setupVideoAnalytics (player, callbacks = {
      onPause: () => {},
      onSkip: () => {},
      onEnded: () => {}
    }) {
      // Send started to analytics
      const onPlay = () => {
        const { videoId } = player.getMediaObject()
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
      const onPause = async () => {
        try {
          player.showLoading()
          const { videoId } = player.getMediaObject()
          const time = player.currentTime()
          const closePaused = player.getClosePaused()
          const status = closePaused ? 'CLOSED' : 'PAUSED'
          player.resetClosePaused()

          await this.sendVideoAnalytics({
            videoId,
            time,
            status
          })

          await callbacks.onPause()
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        } finally {
          player.hideLoading()
        }
      }

      // Send skipped to analytics
      const onSkipped = async () => {
        try {
          player.showLoading()
          const { videoId } = player.getMediaObject()
          const time = player.currentTime()
          const status = 'SKIPPED'

          await this.sendVideoAnalytics({
            videoId,
            time,
            status
          })

          await callbacks.onSkip()
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        } finally {
          player.hideLoading()
        }
      }

      // Send completed to analytics
      const onEnded = async () => {
        try {
          player.showLoading()
          const { videoId } = player.getMediaObject()
          const time = player.currentTime()
          const status = 'COMPLETED'

          await this.sendVideoAnalytics({
            videoId,
            time,
            status
          })

          await callbacks.onEnded()
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error)
        } finally {
          player.hideLoading()
        }
      }

      // Send completed to analytics
      const onClosed = () => {
        const { videoId } = player.getMediaObject()
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
