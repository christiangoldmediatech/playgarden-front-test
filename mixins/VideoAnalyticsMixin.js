import { mapActions } from 'vuex'

const defaultCallbacks = {
  onBeforePause: () => {},
  onPause: () => {},
  onBeforeSkip: () => {},
  onSkip: () => {},
  onBeforeEnded: () => {},
  onEnded: () => {},
  onBeforeClosed: () => {},
  onClosed: () => {}
}

export default {
  methods: {
    ...mapActions('video', ['sendVideoAnalytics']),

    setupVideoAnalytics (player, suppliedCallbacks = {}) {
      const callbacks = {
        ...defaultCallbacks,
        ...suppliedCallbacks
      }

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
          await callbacks.onBeforePause()
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
          await callbacks.onBeforeSkip()
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
          await callbacks.onBeforeEnded()
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
      const onClosed = async () => {
        await callbacks.onBeforeClosed()
        const { videoId } = player.getMediaObject()
        const time = player.currentTime()
        const status = 'CLOSED'

        await this.sendVideoAnalytics({
          videoId,
          time,
          status
        })

        await callbacks.onClosed()
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
