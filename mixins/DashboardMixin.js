export default {
  computed: {
    overrides () {
      return {
        childId: this.$route.query.childId,
        lessonId: this.$route.query.lessonId,
        ...this.customOverrides
      }
    },

    videos () {
      // Exit if lesson or videos are not loaded
      if (!this.lesson || this.lesson.videos.length === 0) {
        return {
          progress: 0,
          items: []
        }
      }

      // Calculate progress
      const completedCount = this.lesson.videos.map(({ viewed }) => Number(viewed && viewed.completed ? 1 : 0))
        .reduce((a, b) => a + b)

      const progress = (completedCount / this.lesson.videos.length) * 100

      // Get items for links
      const videos = this.lesson.videos.map(({ id, activityType, name, description, viewed }, i) => {
        let disabled = false
        const previous = i > 0 ? this.lesson.videos[i - 1] : null
        if (previous) {
          disabled = !(previous.viewed && previous.viewed.completed)
        }
        return {
          id,
          name,
          description,
          activityType,
          to: {
            name: 'app-dashboard-lesson-videos',
            query: { ...this.overrides, id }
          },
          viewed,
          disabled
        }
      })

      return {
        progress,
        items: videos
      }
    },

    worksheets () {
      // Exit if lesson or worksheets are not loaded
      const result = {
        OFFLINE: null,
        ONLINE: [],
        progress: 0
      }

      if (!this.lesson || this.lesson.worksheets.length === 0) {
        return result
      }

      const worksheets = this.lesson ? this.lesson.worksheets || [] : []

      const completedCount = worksheets.map(({ completed }) => Number(completed ? 1 : 0))
        .reduce((a, b) => a + b)

      result.progress = worksheets.length ? (completedCount / worksheets.length) * 100 : 0

      worksheets.map((i) => {
        if (i.type === 'ONLINE') {
          result.ONLINE.push(i)
        } else if (i.type === 'OFFLINE') {
          result.OFFLINE = i
        }
      })

      return result
    },

    activities () {
      if (!this.lesson || this.lesson.lessonsActivities.length === 0) {
        return {
          progress: 0,
          items: []
        }
      }

      // Make it simpler
      const activities = this.lesson.lessonsActivities.map(({ activity }) => {
        return {
          ...activity
        }
      })

      // Calculate progress
      const completedCount = activities.map(({ viewed }) => Number(viewed && viewed.completed ? 1 : 0))
        .reduce((a, b) => a + b)

      const progress = (completedCount / activities.length) * 100

      // Get items for links
      const videos = activities.map(({ id, activityType, videos, viewed }, i) => {
        let disabled = (this.videos.progress !== 100)
        const previous = i > 0 ? activities[i - 1] : null
        if (previous) {
          disabled = !(previous.viewed && previous.viewed.completed)
        }
        return {
          id,
          name: videos.name,
          description: videos.description,
          activityType,
          to: {
            name: 'app-dashboard-lesson-activities',
            query: { ...this.overrides, id }
          },
          viewed,
          disabled
        }
      })

      return {
        progress,
        items: videos
      }
    }
  }
}
