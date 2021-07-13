import { mapActions, mapGetters } from 'vuex'
import { jsonCopy } from '@/utils/objectTools'

export default {
  data: () => {
    return {
      savingProgress: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters({ children: 'getCurrentChild' })
  },

  methods: {
    ...mapActions('children/lesson', { sendVideoProgress: 'saveVideoProgress' }),

    async saveVideoProgress (completeOverride = false) {
      try {
        // Save it before we have moved on
        const currentVideo = jsonCopy(this.currentVideo)
        if (
          this.lesson.previewMode ||
              !currentVideo ||
              currentVideo.ignoreVideoProgress ||
              this.savingProgress
        ) {
          return
        }
        const date = new Date().toISOString().substr(0, 19)
        const time = this.player.currentTime()
        const duration = this.player.duration()
        const promises = []

        this.savingProgress = true
        this.children.forEach((child) => {
          promises.push(
            this.sendVideoProgress({
              lessonId: this.lesson.id,
              childId: child.id,
              video: {
                id: currentVideo.videoId,
                completed: completeOverride || duration - time <= 30,
                time,
                date
              }
            })
          )
        })

        await Promise.allSettled(promises)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.$nuxt.$emit('dashboard-panel-update')
        this.savingProgress = false
      }
    }
  }
}
