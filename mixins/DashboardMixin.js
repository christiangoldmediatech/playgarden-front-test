import DashboardLink from './DashboardLinkMixin.js'

export default {
  mixins: [DashboardLink],

  computed: {
    letter () {
      if (this.lesson) {
        return this.lesson.curriculumType.letter
      }
      return ''
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
      let completedCount = 0
      for (let i = 0; i < this.lesson.videos.length; i++) {
        const viewed = this.lesson.videos[i].viewed
        if (viewed && viewed.completed) {
          completedCount++
        } else {
          break
        }
      }

      const progress = (completedCount / this.lesson.videos.length) * 100
      const progressNext = (completedCount < this.lesson.videos.length) ? ((completedCount + 1) / this.lesson.videos.length) * 100 : 100

      // Get items for links
      const videos = this.lesson.videos.map(({ id, activityType, name, description, viewed, thumbnail }, i) => {
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
          thumbnail,
          to: this.generateNuxtRoute('lesson-videos', { id }),
          viewed,
          disabled
        }
      })

      return {
        progress,
        progressNext,
        items: videos
      }
    },

    worksheets () {
      // Exit if lesson or worksheets are not loaded
      const result = {
        OFFLINE: null,
        ONLINE: [],
        progress: 0,
        progressNext: 0
      }

      if (!this.lesson || this.lesson.worksheets.length === 0) {
        return result
      }

      const worksheets = this.lesson ? this.lesson.worksheets || [] : []

      // TODO: Restore progress count to include offline worksheets
      // Temporarily removed until we decide how to count offline worksheet progress

      // const completedCount = worksheets.map(({ completed }) => Number(completed ? 1 : 0))
      //  .reduce((a, b) => a + b)

      const onlineWorksheets = worksheets.filter(worksheet => worksheet.type === 'ONLINE')
      const worksheetCount = onlineWorksheets.length
      const completedCount = onlineWorksheets
        .map(({ completed }) => Number(completed ? 1 : 0))
        .reduce((a, b) => a + b)

      // result.progress = worksheets.length ? (completedCount / worksheets.length) * 100 : 0
      // result.progressNext = (worksheets.length && completedCount < worksheets.length) ? ((completedCount + 1) / worksheets.length) * 100 : 100

      result.totalCompletedWorksheets = completedCount
      result.totalWorksheets = worksheets.length

      result.progress = worksheetCount ? (completedCount / worksheetCount) * 100 : 0
      result.progressNext = (worksheetCount && completedCount < worksheetCount) ? ((completedCount + 1) / worksheetCount) * 100 : 100

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
      const progressNext = (completedCount < activities.length) ? ((completedCount + 1) / activities.length) * 100 : 100

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
          thumbnail: videos.thumbnail,
          to: this.generateNuxtRoute('lesson-activities', { id }),
          viewed,
          disabled
        }
      })

      return {
        progress,
        progressNext,
        items: videos
      }
    },

    lessonCompleted () {
      return (this.videos.progress === 100 && this.worksheets.progress === 100 && this.activities.progress === 100)
    }
  }
}
