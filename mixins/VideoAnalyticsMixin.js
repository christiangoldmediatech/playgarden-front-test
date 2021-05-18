import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('video', ['sendVideoAnalytics']),

    setupVideoAnalytics (player) {
      // Send started to analytics
      player.on('play', () => {
        const { videoId } = player.getMediaObject()
        const time = player.currentTime()
        const status = 'STARTED'

        this.sendVideoAnalytics({ videoId, time, status })
      })

      // Send paused to analytics
      player.on('pause', () => {
        const { videoId } = player.getMediaObject()
        const time = player.currentTime()
        const status = 'PAUSED'

        this.sendVideoAnalytics({ videoId, time, status })
      })

      // Send completed to analytics
      player.on('skipped', () => {
        const { videoId } = player.getMediaObject()
        const time = player.currentTime()
        const status = 'SKIPPED'

        this.sendVideoAnalytics({ videoId, time, status })
      })

      // Send completed to analytics
      player.on('ended', () => {
        const { videoId } = player.getMediaObject()
        const time = player.currentTime()
        const status = 'COMPLETED'

        this.sendVideoAnalytics({ videoId, time, status })
      })
    }
  }
}
